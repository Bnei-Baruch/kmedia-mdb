import { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ulid } from 'ulid';
import { chroniclesUrl, chroniclesBackendEnabled } from './Api';
import { noop, partialAssign } from './utils';

import { actions } from '../redux/modules/chronicles';
import { selectors as settings } from '../redux/modules/settings';
import { types as recommendedTypes } from '../redux/modules/recommended';
import { types as searchTypes } from '../redux/modules/search';
import { types as authTypes } from '../redux/modules/auth';
import { ClientChroniclesContext } from './app-contexts';

//An array of DOM events that should be interpreted as user activity.
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

const FLOWS = [
  { start: 'page-enter',               end: 'page-leave',                 subFlows: ['recommend', 'search', 'autocomplete', 'user-inactive', 'download'] },
  { start: 'unit-page-enter',          end: 'unit-page-leave',            subFlows: ['player-play', 'recommend', 'search', 'autocomplete', 'user-inactive', 'download'] },
  { start: 'collection-page-enter',    end: 'collection-page-leave',      subFlows: ['collection-unit-selected', 'recommend', 'search', 'autocomplete', 'user-inactive', 'download'] },
  { start: 'collection-unit-selected', end: 'collection-unit-unselected', subFlows: ['player-play', 'user-inactive'] },
  { start: 'player-play', end: 'player-stop', subFlows: ['mute-unmute', 'user-inactive'] },
  { start: 'recommend', end: '', subFlows: ['recommend-selected'] },
  { start: 'search', end: '', subFlows: ['search-selected'] },
  { start: 'autocomplete', end: '', subFlows: ['autocomplete-selected'] },
];

const FLOWS_BY_END = new Map(FLOWS.map(flow => [flow.end, flow]));
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

    this.keycloakId = null;

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
    }, 60000);

    window.addEventListener('beforeunload', event => {
      this.sessionActivities.add('beforeunload');
      if (this.currentPathname) {
        // Sync is false here because it will be sent together with user-inactive append.
        this.appendPage('leave', /* sync= */ false);
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
    this.currentPathname = window.location.pathname;
    this.appendPage('enter');
    history.listen(historyEvent => {
      if (historyEvent.pathname !== this.currentPathname) {
        if (this.currentPathname) {
          this.appendPage('leave');
        }

        this.currentPathname = historyEvent.pathname;
        this.appendPage('enter');
      }

      if (window.location.href !== this.prevHref) {
        this.prevHref = window.location.href;
      }
    });

    this.uiLanguage = '';
    this.contentLanguage = '';
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
    if (action.type === recommendedTypes.FETCH_RECOMMENDED_SUCCESS) {
      const { feeds, requestData } = action.payload;
      if (feeds && Object.keys(feeds).length) {
        const recommendations = Object.fromEntries(Object.entries(action.payload.feeds).map(
          ([key, items]) => [key, !items ? [] : items.map(({ uid, content_type }) => ({ uid, content_type }))]));
        this.append('recommend', { request_data: requestData, recommendations });
      }
    }

    if (action.type === searchTypes.SEARCH_SUCCESS) {
      const { searchResults, searchRequest } = action.payload;
      const reducedResults                   = partialAssign({}, searchResults, {
        language: true,
        search_result: {
          hits: {
            hits: { // This is an array.
              _index: true,
              _type: true,
              _source: {
                mdb_uid: true,
                result_type: true,
                filter_values: true,
                landing_page: true,
              },
              _score: true,
            },
            max_score: true,
            total: true,
          },
          searchId: true,
          timed_out: true,
          took: true,
        },
        typo_suggest: true,
      });
      const appendData                       = { search_results: reducedResults, search_request: searchRequest };
      this.append('search', appendData);
    }

    if (action.type === searchTypes.AUTOCOMPLETE_SUCCESS) {
      const { suggestions, request } = action.payload;
      const reducedSuggestions       = partialAssign({}, suggestions, {
        suggest: {
          title_suggest: { // This is an array.
            options: {  // This is an array.
              text: true,
              _source: {
                result_type: true,
                mdb_uid: true,
              },
            }
          },
          'title_suggest.language': { // This is an array.
            options: {  // This is an array.
              text: true,
              _source: {
                result_type: true,
                mdb_uid: true,
              },
            }
          },
        },
        timed_out: true,
        took: true,
      });
      const appendData               = { suggestions: reducedSuggestions, request };
      this.append('autocomplete', appendData);
    }

    if (action.type === authTypes.LOGIN_SUCCESS) {
      this.keycloakId = action.payload.user?.id;
    }

    if (action.type === authTypes.LOGOUT_SUCCESS) {
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
      pathname: this.currentPathname,
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

    // Maps entry types to the last timestamp they happened. This is required to properly
    // assign flows to entries.
    this.LastEntriesByType = new Map();

    this.firstActivityTimestampMs = Date.now();
    this.lastActivityTimestampMs  = this.firstActivityTimestampMs;
    this.sessionActivities        = new Set();
  }

  lastEventType() {
    return Array.from(this.LastEntriesByType.entries()).reduce((max, [eventType, { timestamp }]) => {
      if (timestamp > max.timestamp) {
        return { eventType, timestamp };
      }

      return max;
    }, { eventType: '', timestamp: this.firstActivityTimestampMs });
  }

  isPlayerPlaying() {
    const play = this.LastEntriesByType.get('player-play');
    const stop = this.LastEntriesByType.get('player-stop');
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

  append(eventType, data, sync = false) {
    data.ab = this.abTesting;
    data.ui_language = this.uiLanguage;
    data.content_language = this.contentLanguage;
    data.location = eventType.endsWith('page-leave') ? this.prevHref : window.location.href;
    const eventId = ulid();
    const nowTimestampMs = Date.now();
    let flowId           = '';
    let flowType         = '';
    if (FLOWS_BY_END.has(eventType)) {
      // Ending event of a flow.
      // 1. We don't set flowType for end, just for subflow (see else).
      // 2. After use inactive, there might not be start event at all, so defaulting to empty string.
      flowId = this.LastEntriesByType.get(FLOWS_BY_END.get(eventType).start)?.eventId ?? '';
    } else {
      // Subflow.
      let latest = 0;
      (SUBFLOWS.get(eventType) || []).forEach(flowStart => {
        const { timestamp = 0, eventId = null } = this.LastEntriesByType.get(flowStart) || {};
        if (timestamp > latest) {
          latest   = timestamp;
          flowId   = eventId;
          flowType = flowStart;
        }
      });
    }

    const append = {
      client_session_id: this.sessionId,
      namespace: this.namespace,
      client_event_id: eventId,
      client_event_type: eventType,
      client_flow_id: flowId,
      client_flow_type: flowType,
      data,
    };

    if (this.keycloakId) {
      append.keycloak_id = this.keycloakId;
    } else {
      append.client_id = this.userId;
    }

    this.LastEntriesByType.set(eventType, { timestamp: nowTimestampMs, eventId });

    this.timestampedAppends.push({ timestamp: nowTimestampMs, append });
    if (sync) {
      this.flushAppends(sync);
    }
  }
}

// Have to add the relevant actions to redux/modules/chronicles.js for this to work.
export const ChroniclesActions = () => {
  const clientChronicles = useContext(ClientChroniclesContext);
  const action = useSelector(state => state.chronicles.lastAction);
  const actionsCount = useSelector(state => state.chronicles.actionsCount);
  clientChronicles.uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  clientChronicles.contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));
  useEffect(() => {
    if (action) {
      clientChronicles.onAction(action);
    }
  }, [action, actionsCount, clientChronicles]);
  return null;
};
