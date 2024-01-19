import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ulid } from 'ulid';
import { chroniclesUrl, chroniclesBackendEnabled } from './Api';
import { noop, partialAssign } from './utils';

import { actions } from '../redux/modules/chronicles';
import { types as recommendedTypes } from '../redux/modules/recommended';
import { types as searchTypes } from '../redux/modules/search';
import { types as authTypes } from '../redux/modules/auth';
import { ClientChroniclesContext } from './app-contexts';
import { chroniclesGetActionCountSelector, settingsGetContentLanguagesSelector, chroniclesGetLastActionSelector, settingsGetUILangSelector } from '../redux/selectors';

// An array of DOM events that should be interpreted as user activity.
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

const FLOWS = [
  { start: 'page-enter', end: 'page-leave', subFlows: ['recommend', 'search', 'autocomplete', 'user-inactive', 'download'] },
  { start: 'unit-page-enter', end: 'unit-page-leave', subFlows: ['player-play', 'recommend', 'search', 'autocomplete', 'user-inactive', 'download'] },
  { start: 'collection-page-enter', end: 'collection-page-leave', subFlows: ['collection-unit-selected', 'recommend', 'search', 'autocomplete', 'user-inactive', 'download'] },
  { start: 'collection-unit-selected', end: 'collection-unit-unselected', subFlows: ['player-play', 'user-inactive'] },
  { start: 'player-play', end: 'player-stop', subFlows: ['mute-unmute', 'user-inactive'] },
  { start: 'recommend', end: '', subFlows: ['recommend-selected'] },
  { start: 'search', end: '', subFlows: ['search-selected'] },
  { start: 'autocomplete', end: '', subFlows: ['autocomplete-selected'] }
];

const PREV_HREF_EVENTS = ['page-leave', 'unit-page-leave', 'collection-page-leave', 'recommend-selected', 'search-selected'];

const FLOWS_BY_END = new Map(FLOWS.filter(flow => flow.end).map(flow => [flow.end, flow]));
const SUBFLOWS     = new Map(Object.entries(FLOWS.reduce((acc, flow) => {
  flow.subFlows.forEach(subflow => {
    if (!(subflow in acc)) {
      acc[subflow] = [];
    }

    if (!acc[subflow].includes(flow.start)) {
      acc[subflow].push(flow.start);
    }
  });
  return acc;
}, {})));

const MAX_INACTIVITY_MS = 60 * 1000; // Minute in milliseconds.
const APPENDS_FLUSH_MS  = 60 * 1000; // Minute in milliseconds.

export default class ClientChronicles {
  constructor(history, store) {
    // If chronicles backend not defined in env.
    if (!chroniclesBackendEnabled) {
      this.append = noop;
      return;
    }

    const { localStorage } = window;
    if (localStorage.getItem('user_id') === null) {
      localStorage.setItem('user_id', `local:${ulid()}`);
    }

    this.userId = localStorage.getItem('user_id');

    this.namespace = 'archive';

    this.abTesting = {};

    const authStore = store.getState().auth;
    this.keycloakId = authStore?.user?.id || null;

    this.initSession(/* reinit= */ false);

    // Store all appends in order to send them in bulks.
    this.timestampedAppends = [];

    // Setup the setInterval method to run every second.
    setInterval(() => {
      // Check for inactivity, only if was active since last inactive timestamp.
      if (this.isUserActive() && !this.isPlayerPlaying() && Date.now() - this.lastActivityTimestampMs > MAX_INACTIVITY_MS) {
        // if the user has been inactive or idle for longer then the seconds specified in MAX_INACTIVITY_MS.
        console.log(`User has been inactive for more than ${MAX_INACTIVITY_MS} ms.`);
        this.append('user-inactive', { activities: Array.from(this.sessionActivities) });
        store.dispatch(actions.userInactive());
      }
    }, 1000);

    setInterval(() => {
      // Send all appends to chronicles server.
      if (this.timestampedAppends.length) {
        this.flushAppends(/* sync */ false);
      }
    }, APPENDS_FLUSH_MS);

    window.addEventListener('beforeunload', event => {
      this.sessionActivities.add('beforeunload');
      if (this.currentPathname) {
        // Sync is false here because it will be sent together with user-inactive append.
        this.appendPage('leave', /* sync= */ false);
      }

      for (const { onBeforeUnloadClosure } of this.lastEntriesByType.values()) {
        if (!!onBeforeUnloadClosure) {
          onBeforeUnloadClosure();
        }
      }

      this.append('user-inactive', { activities: Array.from(this.sessionActivities) }, /* sync= */ true);
      store.dispatch(actions.userInactive());
    }, true);

    // Handle events to update activity.
    ACTIVITY_EVENTS.forEach(eventName => {
      document.addEventListener(eventName, () => {
        if (!this.isUserActive()) {
          // User back from inactive state. This is a new session.
          this.initSession(/* reinit */ true);
        } else {
          this.lastActivityTimestampMs = Date.now();
        }

        this.sessionActivities.add(eventName);
      }, true);
    });

    this.prevHref        = window.location.href;
    this.currentHref     = window.location.href;
    this.prevPathname    = window.location.pathname;
    this.currentPathname = window.location.pathname;
    this.appendPage('enter');
    history.listen(historyEvent => {
      if (historyEvent.pathname !== this.currentPathname) {
        if (this.currentPathname) {
          store.dispatch(actions.pauseOnLeave());
          this.appendPage('leave');
        }

        this.prevPathname    = this.currentPathname;
        this.currentPathname = historyEvent.location.pathname;
        this.appendPage('enter');
      }

      const currentUrl = new URL(this.currentHref);
      // Ignore params in comparison of prev page.
      if (`${window.location.origin}${window.location.pathname}` !== `${currentUrl.origin}${currentUrl.pathname}`) {
        this.prevHref    = this.currentHref;
        this.currentHref = window.location.href;
      }
    });

    this.uiLanguage       = '';
    this.contentLanguages = [];
  }

  setAbTesting(abTesting) {
    if (!chroniclesBackendEnabled) {
      return;
    }

    for (const key in abTesting) {
      if (typeof abTesting[key] === 'string') {
        this.abTesting[key] = abTesting[key];
      }
    }
  }

  // Handles custom redux actions to append events on them.
  // Note: Have to add the relevant actions to redux/modules/chronicles.js for this to work.
  onAction(action) {
    if (action.type === recommendedTypes['recommended/fetchRecommendedSuccess']) {
      const { feeds, requestData } = action.payload;
      if (feeds && Object.keys(feeds).length) {
        const recommendations = Object.fromEntries(Object.entries(action.payload.feeds).map(
          ([key, items]) => [key, !items ? [] : items.map(({ uid, content_type }) => ({ uid, content_type }))]));
        this.append('recommend', { request_data: requestData, recommendations });
      }
    }

    if (action.type === searchTypes['search/searchSuccess']) {
      const { searchResults, searchRequest } = action.payload;
      const reducedResults                   = partialAssign({}, searchResults, {
        language     : true,
        search_result: {
          hits     : {
            hits     : { // This is an array.
              _index : true,
              _type  : true,
              _source: {
                mdb_uid      : true,
                result_type  : true,
                filter_values: true,
                landing_page : true
              },
              _score : true
            },
            max_score: true,
            total    : true
          },
          searchId : true,
          timed_out: true,
          took     : true
        },
        typo_suggest : true
      });
      const appendData                       = { search_results: reducedResults, search_request: searchRequest };
      this.append('search', appendData);
    }

    if (action.type === searchTypes['search/autocompleteSuccess']) {
      const { suggestions, request } = action.payload;
      const reducedSuggestions       = partialAssign({}, suggestions, {
        suggest  : {
          title_suggest           : { // This is an array.
            options: {  // This is an array.
              text   : true,
              _source: {
                result_type: true,
                mdb_uid    : true
              }
            }
          },
          'title_suggest.language': { // This is an array.
            options: {  // This is an array.
              text   : true,
              _source: {
                result_type: true,
                mdb_uid    : true
              }
            }
          }
        },
        timed_out: true,
        took     : true
      });
      const appendData               = { suggestions: reducedSuggestions, request };
      this.append('autocomplete', appendData);
    }

    if (action.type === authTypes['auth/updateToken']) {
      this.keycloakId = action.payload;
    }

    if (action.type === authTypes['auth/updateUser'] && !action.payload) {
      this.keycloakId = null;
    }
  }

  recommendSelected(uid) {
    this.append('recommend-selected', { uid });
  }

  searchSelected(data) {
    this.append('search-selected', data);
  }

  autocompleteSelected(title, autocompleteId) {
    this.append('autocomplete-selected', { title, autocompleteId });
  }

  appendPage(suffix, sync = false) {
    const data = {
      pathname: this.currentPathname
    };

    let prefix = 'collection-';
    let match  = this.currentPathname.match(/\/(latest)$|\/c\/([a-zA-Z0-9]{8})$/);
    if (match) {
      data.collection_uid = match[1];
    } else {
      match  = this.currentPathname.match(/\/cu\/([a-zA-Z0-9]{8})$/);
      prefix = 'unit-';
      if (match) {
        data.unit_uid = match[1];
      } else {
        prefix = '';
      }
    }

    this.append(`${prefix}page-${suffix}`, data, sync);
  }

  initSession(reinit) {
    const { sessionStorage } = window;
    if (reinit || sessionStorage.getItem('session_id') === null) {
      sessionStorage.setItem('session_id', `local:${ulid()}`);
    }

    this.sessionId = sessionStorage.getItem('session_id');

    if (!reinit) {
      // Maps entry types to the last timestamp they happened. This is required to properly
      // assign flows to entries.
      // We don't empty this for user getting back from inactive state so that events will
      // have proper flows and start events. This may cause two events to have different
      // session id.
      this.lastEntriesByType = new Map();
    }

    this.firstActivityTimestampMs = Date.now();
    this.lastActivityTimestampMs  = this.firstActivityTimestampMs;
    this.sessionActivities        = new Set();
  }

  lastEventType() {
    return Array.from(this.lastEntriesByType.entries()).reduce((max, [eventType, { timestamp }]) => {
      if (timestamp > max.timestamp) {
        return { eventType, timestamp };
      }

      return max;
    }, { eventType: '', timestamp: this.firstActivityTimestampMs });
  }

  isPlayerPlaying() {
    const play = this.lastEntriesByType.get('player-play');
    const stop = this.lastEntriesByType.get('player-stop');
    return play && (!stop || play.timestamp > stop.timestamp);
  }

  isUserActive() {
    return this.isPlayerPlaying() || this.lastEventType().eventType !== 'user-inactive';
  }

  flushAppends(sync = false) {
    const nowTimestampMs           = Date.now();
    const appends                  = {
      append_requests: this.timestampedAppends.map(timestampAppend => ({
        append: timestampAppend.append,
        offset: timestampAppend.timestamp - nowTimestampMs
      }))
    };
    // Clear bulk without checking if post worked or not.
    this.timestampedAppends.length = 0;
    if (sync) {
      (async () => await axios.post(chroniclesUrl('appends'), appends))();
    } else {
      axios.post(chroniclesUrl('appends'), appends)
        .catch(error => {
          console.warn(error);
        });
    }
  }

  append(eventType, data, sync = false, onBeforeUnloadClosure = undefined) {
    data.ab               = this.abTesting;
    data.ui_language      = this.uiLanguage;
    data.contentLanguages = this.contentLanguages;
    data.location         = PREV_HREF_EVENTS.includes(eventType) ? this.prevHref : window.location.href;
    const eventId         = ulid();
    const nowTimestampMs  = Date.now();
    let flowId            = '';
    let flowType          = '';

    if (FLOWS_BY_END.has(eventType)) {
      // Ending event of a flow.
      // 1. We don't set flowType for end, just for subflow (see else).
      // 2. We delete the start event so that other events won't use it as flow-event.
      const { start }  = FLOWS_BY_END.get(eventType);
      const startEvent = this.lastEntriesByType.get(start);
      if (!!startEvent) {
        flowId = startEvent.eventId;
        this.lastEntriesByType.delete(start);
      }
    } else {
      // Subflow. Get the latest flow (matching current eventType) that has not ended.
      let latest = 0;
      (SUBFLOWS.get(eventType) || []).forEach(flowStart => {
        const { timestamp = 0, eventId = null } = this.lastEntriesByType.get(flowStart) || {};
        if (timestamp > latest) {
          latest   = timestamp;
          flowId   = eventId;
          flowType = flowStart;
        }
      });
    }

    const append = {
      client_session_id: this.sessionId,
      namespace        : this.namespace,
      client_event_id  : eventId,
      client_event_type: eventType,
      client_flow_id   : flowId,
      client_flow_type : flowType,
      data
    };

    if (this.keycloakId) {
      append.keycloak_id = this.keycloakId;
    } else {
      append.client_id = this.userId;
    }

    this.lastEntriesByType.set(eventType, { timestamp: nowTimestampMs, eventId, onBeforeUnloadClosure });

    this.timestampedAppends.push({ timestamp: nowTimestampMs, append });
    if (sync) {
      this.flushAppends(sync);
    }
  }
}

// Have to add the relevant actions to redux/modules/chronicles.js for this to work.
export const ChroniclesActions = () => {
  const clientChronicles = useContext(ClientChroniclesContext);
  const action           = useSelector(chroniclesGetLastActionSelector);
  const actionsCount     = useSelector(chroniclesGetActionCountSelector);
  const uiLanguage       = useSelector(settingsGetUILangSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  if (clientChronicles) {
    clientChronicles.uiLanguage       = uiLanguage;
    clientChronicles.contentLanguages = contentLanguages;
  }

  useEffect(() => {
    if (action && clientChronicles) {
      clientChronicles.onAction(action);
    }
  }, [action, actionsCount, clientChronicles]);

  return null;
};
