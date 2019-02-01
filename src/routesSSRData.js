import uniq from 'lodash/uniq';
import moment from 'moment';

import {
  CT_ARTICLE,
  CT_CLIP,
  CT_FRIENDS_GATHERING,
  CT_LECTURE,
  CT_LESSON_PART,
  CT_MEAL,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  RABASH_PERSON_UID,
} from './helpers/consts';
import MediaHelper from './helpers/media';
import { canonicalCollection, isEmpty } from './helpers/utils';
import { getQuery } from './helpers/url';
import { selectors as settingsSelectors } from './redux/modules/settings';
import { actions as mdbActions, selectors as mdbSelectors } from './redux/modules/mdb';
import { actions as filtersActions } from './redux/modules/filters';
import { actions as listsActions } from './redux/modules/lists';
import { actions as homeActions } from './redux/modules/home';
import { actions as eventsActions } from './redux/modules/events';
import { actions as lessonsActions } from './redux/modules/lessons';
import { actions as programsActions } from './redux/modules/programs';
import { actions as searchActions, selectors as searchSelectors } from './redux/modules/search';
import { selectors as sourcesSelectors } from './redux/modules/sources';
import { actions as assetsActions, selectors as assetsSelectors } from './redux/modules/assets';
import { actions as tagsActions } from './redux/modules/tags';
import { actions as publicationsActions } from './redux/modules/publications';
import { actions as simpleModeActions } from './redux/modules/simpelMode';
import * as mdbSagas from './sagas/mdb';
import * as filtersSagas from './sagas/filters';
import * as eventsSagas from './sagas/events';
import * as lessonsSagas from './sagas/lessons';
import * as searchSagas from './sagas/search';
import * as assetsSagas from './sagas/assets';
import * as tagsSagas from './sagas/tags';
import * as publicationsSagas from './sagas/publications';
import withPagination from './components/Pagination/withPagination';

import { tabs as eventsTabs } from './components/Sections/Events/MainPage';
import { tabs as lessonsTabs } from './components/Sections/Lessons/MainPage';
import { tabs as programsTabs } from './components/Sections/Programs/MainPage';
import { tabs as pulicationsTabs } from './components/Sections/Publications/MainPage';
import PDF from './components/shared/PDF/PDF';

export const home = (store, match) => {
  store.dispatch(homeActions.fetchData());
  return Promise.resolve(null);
};

export const cuPage = (store, match) => {
  const cuID = match.params.id;
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
  case 'programs-main':
    return { content_type: [CT_VIDEO_PROGRAM_CHAPTER] };
  case 'programs-clips':
    return { content_type: [CT_CLIP] };
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
    // case 'lessons-children':
    //   return { content_type: [CT_CHILDREN_LESSON] };
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
  const page = withPagination.getPageFromLocation(match.parsedURL);
  store.dispatch(listsActions.setPage(ns, page));

  const pageSize = settingsSelectors.getPageSize(store.getState().settings);

  // extraFetchParams
  const extraFetchParams = getExtraFetchParams(ns, collectionID);

  // dispatch fetchList
  store.dispatch(listsActions.fetchList(ns, page, { ...extraFetchParams, pageSize }));

  return Promise.resolve(null);
};

export const collectionPage = ns => (store, match) => {
  const cID = match.params.id;
  return store.sagaMiddleWare.run(mdbSagas.fetchCollection, mdbActions.fetchCollection(cID)).done
    .then(() => {
      cuListPage(ns, cID)(store, match);
    });
};

export const playlistCollectionPage = (store, match) => {
  const cID = match.params.id;
  return store.sagaMiddleWare.run(mdbSagas.fetchCollection, mdbActions.fetchCollection(cID)).done
    .then(() => {
      // TODO: replace this with a single call to backend with all IDs
      // I don't think we need all files of every unit. Just for active one.
      const c = mdbSelectors.getCollectionById(store.getState().mdb, cID);
      c.cuIDs.forEach((cuID) => {
        store.dispatch(mdbActions.fetchUnit(cuID));
      });
    });
};

export const latestLesson = store =>
  store.sagaMiddleWare.run(mdbSagas.fetchLatestLesson).done
    .then(() => {
      // TODO: replace this with a single call to backend with all IDs
      // I don't think we need all files of every unit. Just for active one.
      const state = store.getState();
      const cID   = mdbSelectors.getLastLessonId(state.mdb);
      const c     = mdbSelectors.getCollectionById(state.mdb, cID);
      c.cuIDs.forEach((cuID) => {
        store.dispatch(mdbActions.fetchUnit(cuID));
      });
    });

export const eventsPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || eventsTabs[0];
  if (tab !== eventsTabs[0]) {
    store.dispatch(eventsActions.setTab(tab));
  }
  const ns = `events-${tab}`;

  // UnitList
  if (tab === 'friends-gatherings' || tab === 'meals') {
    return cuListPage(ns)(store, match);
  }

  // CollectionList
  store.dispatch(filtersActions.hydrateFilters(ns));
  return store.sagaMiddleWare.run(eventsSagas.fetchAllEvents, eventsActions.fetchAllEvents()).done;
};

export const lessonsPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || lessonsTabs[0];
  if (tab !== lessonsTabs[0]) {
    store.dispatch(lessonsActions.setTab(tab));
  }

  if (tab === 'series') {
    return store.sagaMiddleWare.run(lessonsSagas.fetchAllSeries, lessonsActions.fetchAllSeries).done;
  }

  const ns = `lessons-${tab}`;
  return cuListPage(ns)(store, match);
};

export const programsPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || programsTabs[0];
  if (tab !== programsTabs[0]) {
    store.dispatch(programsActions.setTab(tab));
  }

  const ns = `programs-${tab}`;
  return cuListPage(ns)(store, match);
};

export const simpleMode = (store, match) => {
  const query        = getQuery(match.parsedURL);
  const date         = (query.date && moment(query.date).isValid()) ? moment(query.date, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
  const { language } = match.params;

  store.dispatch(simpleModeActions.fetchForDate({ date, language }));
  return Promise.resolve(null);
};

export const lessonsCollectionPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || lessonsTabs[0];
  if (tab !== lessonsTabs[0]) {
    store.dispatch(lessonsActions.setTab(tab));
  }

  if (tab === 'daily' || tab === 'series') {
    return playlistCollectionPage(store, match);
  }

  return collectionPage('lessons-collection')(store, match);
};

export const searchPage = store =>
  Promise.all([
    store.sagaMiddleWare.run(searchSagas.hydrateUrl).done,
    store.sagaMiddleWare.run(filtersSagas.hydrateFilters, filtersActions.hydrateFilters('search')).done
  ])
    .then(() => {
      const state    = store.getState();
      const q        = searchSelectors.getQuery(state.search);
      const page     = searchSelectors.getPageNo(state.search);
      const pageSize = settingsSelectors.getPageSize(state.settings);
      const deb      = searchSelectors.getDeb(state.search);
      const suggest  = searchSelectors.getSuggest(state.search);

      store.dispatch(searchActions.search(q, page, pageSize, suggest, deb));
    });

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

export const libraryPage = async (store, match) => {
  // This is a rather ugly, timeout, sleep, loop.
  // We wait for sources to be loaded so we could
  // determine the firstLeadfID for redirection.
  // Fix for AR-356
  let timeout = 5000;
  while (timeout && !sourcesSelectors.areSourcesLoaded(store.getState().sources)) {
    timeout -= 10;
    await sleep(10); // eslint-disable-line no-await-in-loop
  }

  const sourcesState = store.getState().sources;
  let sourceID       = match.params.id;
  if (sourcesSelectors.areSourcesLoaded(sourcesState)) {
    const getSourceById = sourcesSelectors.getSourceById(sourcesState);
    sourceID            = firstLeafId(sourceID, getSourceById);
  }

  return store.sagaMiddleWare.run(assetsSagas.sourceIndex, assetsActions.sourceIndex(sourceID)).done
    .then(() => {
      const state    = store.getState();
      const { data } = assetsSelectors.getSourceIndexById(state.assets)[sourceID];
      if (!data) {
        return;
      }

      let language    = null;
      const uiLang    = settingsSelectors.getLanguage(state.settings);
      const languages = [...Object.keys(data)];
      if (languages.length > 0) {
        language = languages.indexOf(uiLang) === -1 ? languages[0] : uiLang;
      }

      if (data[language]) {
        if (data[language].pdf && PDF.isTaas(sourceID)) {
          return; // no need to fetch pdf. we don't do that on SSR
        }

        const name = data[language].html;
        store.dispatch(assetsActions.fetchAsset(`sources/${sourceID}/${name}`));
      }
    });
};

export const tweetsListPage = (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters('publications-twitter'));

  // hydrate page
  const page = withPagination.getPageFromLocation(match.parsedURL);
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
  Promise.all([
    store.sagaMiddleWare.run(tagsSagas.fetchDashboard, tagsActions.fetchDashboard(tagID)).done,
    // store.sagaMiddleWare.run(tagsSagas.fetchTags, tagsActions.fetchTags).done
  ]);
};

export const blogListPage = (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters('publications-blog'));

  // hydrate page
  const page = withPagination.getPageFromLocation(match.parsedURL);
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
  if (tab !== pulicationsTabs[0]) {
    store.dispatch(publicationsActions.setTab(tab));
  }
  const ns = `publications-${tab}`;

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

      const unit      = mdbSelectors.getDenormContentUnit(state.mdb, cuID);
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
