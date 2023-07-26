import uniq from 'lodash/uniq';
import moment from 'moment';
import { getPageFromLocation } from '../components/Pagination/withPagination';
import { tabs as pulicationsTabs } from '../components/Sections/Publications/MainPage';
import { isTaas } from '../components/shared/PDF/PDF';

import {
  COLLECTION_PROGRAMS_TYPE,
  CT_ARTICLE,
  CT_FRIENDS_GATHERING,
  CT_LECTURE,
  CT_LESSON_PART,
  CT_MEAL,
  CT_VIRTUAL_LESSON,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSON,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  PAGE_NS_EVENTS,
  PAGE_NS_LESSONS,
  PAGE_NS_PROGRAMS,
  RABASH_PERSON_UID,
  UNIT_PROGRAMS_TYPE,
} from '../helpers/consts';
import MediaHelper from './../helpers/media';
import { getQuery } from '../helpers/url';
import { canonicalCollection, isEmpty } from '../helpers/utils';
import { actions as assetsActions, selectors as assetsSelectors } from './../redux/modules/assets';
import { actions as eventsActions } from './../redux/modules/events';
import { actions as filtersActions } from './../redux/modules/filters';
import { actions as homeActions } from './../redux/modules/home';
import { actions as listsActions } from './../redux/modules/lists';
import { actions as mdbActions, selectors as mdbSelectors } from './../redux/modules/mdb';
import { actions as musicActions } from './../redux/modules/music';
import { actions as prepareActions } from './../redux/modules/preparePage';
import { actions as publicationsActions } from './../redux/modules/publications';
import { actions as searchActions } from './../redux/modules/search';
import { selectors as settingsSelectors } from './../redux/modules/settings';
import { actions as simpleModeActions } from './../redux/modules/simpleMode';
import { selectors as sourcesSelectors } from './../redux/modules/sources';
import { actions as tagsActions } from './../redux/modules/tags';
import * as assetsSagas from './../sagas/assets';
import * as eventsSagas from './../sagas/events';
import * as filtersSagas from './../sagas/filters';
import * as mdbSagas from './../sagas/mdb';
import * as musicSagas from './../sagas/music';
import * as publicationsSagas from './../sagas/publications';
import * as searchSagas from './../sagas/search';
import * as tagsSagas from './../sagas/tags';

export const home = store => {
  store.dispatch(homeActions.fetchData(true));
  return Promise.resolve(null);
};

export const cuPage = (store, match) => {
  const cuID = match.params.id;
  if (cuID === '%3Canonymous%3E') {
    return Promise.resolve();
  }

  return store.sagaMiddleWare.run(mdbSagas.fetchUnit, mdbActions.fetchUnit(cuID)).done
    .then(() => {
      const state = store.getState();

      const unit = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
      const c    = canonicalCollection(unit);
      if (c) {
        store.dispatch(mdbActions.fetchCollection(c.id));
      }
    });
};

const getExtraFetchParams = (ns, collectionID) => {
  switch (ns) {
    case PAGE_NS_PROGRAMS:
      return { content_type: UNIT_PROGRAMS_TYPE };
    case 'publications-articles':
      return { content_type: [CT_ARTICLE] };
    case 'events-meals':
      return { content_type: [CT_MEAL] };
    case 'events-friends-gatherings':
      return { content_type: [CT_FRIENDS_GATHERING] };
    case 'lessons-virtual':
      return { content_type: [CT_VIRTUAL_LESSON] };
    case 'lessons-lectures':
      return { content_type: [CT_LECTURE] };
    case 'lessons-women':
      return { content_type: [CT_WOMEN_LESSON] };
    case 'lessons-rabash':
      return { content_type: [CT_LESSON_PART], person: RABASH_PERSON_UID };
    default:
      if (collectionID) {
        return { collection: collectionID };
      }
  }

  return {};
};

export const cuListPage = (ns, collectionID = 0) => (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters(ns));

  // hydrate page
  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(listsActions.setPage(ns, page));

  const pageSize = settingsSelectors.getPageSize(store.getState().settings);

  // extraFetchParams
  const extraFetchParams = getExtraFetchParams(ns, collectionID);

  // dispatch fetchList
  store.dispatch(listsActions.fetchList(ns, page, { ...extraFetchParams, pageSize, withViews: true }));

  return Promise.resolve(null);
};

export const collectionPage = ns => (store, match) => {
  const cID = match.params.id;
  if (cID) ns = `${ns}_${cID}`;
  return store.sagaMiddleWare.run(mdbSagas.fetchCollection, mdbActions.fetchCollection(cID)).done
    .then(() => {
      cuListPage(ns, cID)(store, match);
    });
};

export const playlistCollectionPage = (store, match) => {
  const { id: cID, cuId } = match.params;
  return store.sagaMiddleWare.run(mdbSagas.fetchCollection, mdbActions.fetchCollection(cID)).done
    .then(() => {
      const c = mdbSelectors.getCollectionById(store.getState().mdb, cID);
      store.dispatch(mdbActions.fetchUnit(cuId || c?.cuIDs[0]));
    });
};

export const latestLesson = store => (store.sagaMiddleWare.run(mdbSagas.fetchLatestLesson).done
  .then(() => {
    const state = store.getState();
    const cID   = mdbSelectors.getLastLessonId(state.mdb);
    const c     = mdbSelectors.getCollectionById(state.mdb, cID);
    store.dispatch(mdbActions.fetchUnit(c.cuIDs[0]));
  }));

export const musicPage = store => store.sagaMiddleWare.run(musicSagas.fetchMusic, musicActions.fetchMusic).done;

export const eventsPage = store => {
  // CollectionList
  store.dispatch(filtersActions.hydrateFilters(PAGE_NS_EVENTS));
  return store.sagaMiddleWare.run(eventsSagas.fetchAllEvents, eventsActions.fetchAllEvents()).done;
};

export const lessonsPage = (store, match) => {
  store.dispatch(prepareActions.fetchCollections(PAGE_NS_LESSONS, { content_type: [CT_VIRTUAL_LESSONS] }));
  cuListPage(PAGE_NS_LESSONS)(store, match);
};

export const programsPage = (store, match) => {
  store.dispatch(prepareActions.fetchCollections(PAGE_NS_PROGRAMS, { content_type: COLLECTION_PROGRAMS_TYPE }));
  cuListPage(PAGE_NS_PROGRAMS)(store, match);
};

export const simpleMode = (store, match) => {
  const query        = getQuery(match.parsedURL);
  const date         = (query.date && moment(query.date).isValid()) ? moment(query.date, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
  const { language } = match.params;

  store.dispatch(simpleModeActions.fetchForDate({ date, language }));
  return Promise.resolve(null);
};

export const lessonsCollectionPage = (store, match) => {
  const { tab } = match.params;

  if (tab === 'daily' || tab === 'series') {
    return playlistCollectionPage(store, match);
  }

  return collectionPage('lessons-collection')(store, match);
};

export const searchPage = store => (Promise.all([
  store.sagaMiddleWare.run(searchSagas.hydrateUrl).done,
  store.sagaMiddleWare.run(filtersSagas.hydrateFilters, filtersActions.hydrateFilters('search')).done,
]).then(() => store.dispatch(searchActions.search())));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function firstLeafId(sourceId, getSourceById) {
  const { children } = getSourceById(sourceId) || { children: [] };
  if (isEmpty(children)) {
    return sourceId;
  }

  return firstLeafId(children[0], getSourceById);
}

export const libraryPage = async (store, match, show_console = false) => {
  // This is a rather ugly, timeout, sleep, loop.
  // We wait for sources to be loaded so we could
  // determine the firstLeafID for redirection.
  // Fix for AR-356
  let timeout = 5000;
  show_console && console.log('serverRender: libraryPage before fetch sources');
  while (timeout && !sourcesSelectors.areSourcesLoaded(store.getState().sources)) {
    timeout -= 10;
    // eslint-disable-next-line no-await-in-loop
    await sleep(10);
  }

  const sourcesState = store.getState().sources;

  show_console && console.log('serverRender: libraryPage sources was fetched', match.params.id, Object.keys(sourcesState.byId).length);
  let sourceID = match.params.id;
  if (sourcesSelectors.areSourcesLoaded(sourcesState)) {
    const getSourceById = sourcesSelectors.getSourceById(sourcesState);
    sourceID            = firstLeafId(sourceID, getSourceById);
  }
  show_console && console.log('serverRender: libraryPage source was found', sourceID);
  return Promise.all([
    store.sagaMiddleWare.run(assetsSagas.sourceIndex, assetsActions.sourceIndex(sourceID)).done,
    store.sagaMiddleWare.run(mdbSagas.fetchUnit, mdbActions.fetchUnit(sourceID)).done,
  ])
    .then(() => {
      show_console && console.log('serverRender: libraryPage mdb data was fetched');
      const state    = store.getState();
      const { data } = assetsSelectors.getSourceIndexById(state.assets)[sourceID];
      if (!data) {
        return;
      }

      let language      = null;
      const location    = state?.router.location ?? {};
      const query       = getQuery(location);
      const contentLang = query.language || settingsSelectors.getContentLanguage(state.settings);
      const languages   = [...Object.keys(data)];
      if (languages.length > 0) {
        language = languages.indexOf(contentLang) === -1 ? languages[0] : contentLang;
      }

      if (data[language]) {
        if (data[language].pdf && isTaas(sourceID)) {
          return; // no need to fetch pdf. we don't do that on SSR
        }

        const name = data[language].html;

        show_console && console.log('serverRender: libraryPage before fetch assets', sourceID, name);
        store.dispatch(assetsActions.fetchAsset(`sources/${sourceID}/${name}`));
        show_console && console.log('serverRender: libraryPage before fetch labels', sourceID, contentLang);
        store.dispatch(mdbActions.fetchLabels({ content_unit: sourceID, language: contentLang }));
      }
    });
};

export const tweetsListPage = (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters('publications-twitter'));

  // hydrate page
  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(publicationsActions.setPage('publications-twitter', page));

  const state = store.getState();

  const pageSize = settingsSelectors.getPageSize(state.settings);
  const language = settingsSelectors.getLanguage(state.settings);

  // extraFetchParams
  let extraFetchParams;
  switch (language) {
    case LANG_HEBREW:
      extraFetchParams = { username: 'laitman_co_il' };
      break;
    case LANG_UKRAINIAN:
    case LANG_RUSSIAN:
      extraFetchParams = { username: 'Michael_Laitman' };
      break;
    case LANG_SPANISH:
      extraFetchParams = { username: 'laitman_es' };
      break;
    default:
      extraFetchParams = { username: 'laitman' };
      break;
  }

  // dispatch fetchData
  store.dispatch(publicationsActions.fetchTweets('publications-twitter', page, { ...extraFetchParams, pageSize }));

  return Promise.resolve(null);
};

export const topicsPage = (store, match) => {
  const tagID = match.params.id;
  return Promise.all([
    store.sagaMiddleWare.run(tagsSagas.fetchDashboard, tagsActions.fetchDashboard(tagID)).done,
    // store.sagaMiddleWare.run(tagsSagas.fetchTags, tagsActions.fetchTags).done
  ]);
};

export const blogListPage = (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters('publications-blog'));

  // hydrate page
  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(publicationsActions.setPage('publications-blog', page));

  const state = store.getState();

  const pageSize = settingsSelectors.getPageSize(state.settings);
  const language = settingsSelectors.getLanguage(state.settings);

  // extraFetchParams
  let extraFetchParams;
  switch (language) {
    case LANG_HEBREW:
      extraFetchParams = { blog: 'laitman-co-il' };
      break;
    case LANG_UKRAINIAN:
    case LANG_RUSSIAN:
      extraFetchParams = { blog: 'laitman-ru' };
      break;
    case LANG_SPANISH:
      extraFetchParams = { blog: 'laitman-es' };
      break;
    default:
      extraFetchParams = { blog: 'laitman-com' };
      break;
  }

  // dispatch fetchData
  store.dispatch(publicationsActions.fetchBlogList('publications-blog', page, { ...extraFetchParams, pageSize }));

  return Promise.resolve(null);
};

export const publicationsPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || pulicationsTabs[0];
  const ns  = `publications-${tab}`;

  if (tab !== pulicationsTabs[0]) {
    store.dispatch(publicationsActions.setTab(ns));
  }

  switch (tab) {
    case 'articles':
      return cuListPage(ns)(store, match);
    case 'blog':
      return blogListPage(store, match);
    case 'twitter':
      return tweetsListPage(store, match);
    default:
      return Promise.resolve(null);
  }
};

export const articleCUPage = (store, match) => {
  const cuID = match.params.id;
  return store.sagaMiddleWare.run(mdbSagas.fetchUnit, mdbActions.fetchUnit(cuID)).done
    .then(() => {
      const state = store.getState();

      let language = null;
      const uiLang = settingsSelectors.getLanguage(state.settings);

      const unit = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
      if (!unit) {
        return;
      }

      const textFiles = (unit.files || []).filter(x => MediaHelper.IsText(x) && !MediaHelper.IsHtml(x));
      const languages = uniq(textFiles.map(x => x.language));
      if (languages.length > 0) {
        language = languages.indexOf(uiLang) === -1 ? languages[0] : uiLang;
      }

      if (language) {
        const selected = textFiles.find(x => x.language === language) || textFiles[0];
        store.dispatch(assetsActions.doc2html(selected.id));
      }

      const c = canonicalCollection(unit);
      if (c) {
        store.dispatch(mdbActions.fetchCollection(c.id));
      }
    });
};

export const blogPostPage = (store, match) => {
  const { blog, id } = match.params;
  return store.sagaMiddleWare.run(publicationsSagas.fetchBlogPost, publicationsActions.fetchBlogPost(blog, id)).done;
};
