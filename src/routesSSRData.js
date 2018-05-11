import uniq from 'lodash/uniq';

import {
  CT_ARTICLE,
  CT_CHILDREN_LESSON,
  CT_FRIENDS_GATHERING,
  CT_LECTURE,
  CT_MEAL,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  MEDIA_TYPES
} from './helpers/consts';
import { selectors as settingsSelectors } from './redux/modules/settings';
import { actions as mdbActions, selectors as mdbSelectors } from './redux/modules/mdb';
import { actions as filtersActions } from './redux/modules/filters';
import { actions as listsActions } from './redux/modules/lists';
import { actions as homeActions } from './redux/modules/home';
import { actions as eventsActions } from './redux/modules/events';
import { actions as lecturesActions } from './redux/modules/lectures';
import { actions as seriesActions } from './redux/modules/series';
import { actions as searchActions, selectors as searchSelectors } from './redux/modules/search';
import { actions as sourcesActions, selectors as sourcesSelectors } from './redux/modules/sources';
import { actions as assetsActions } from './redux/modules/assets';
import * as mdbSagas from './sagas/mdb';
import * as filtersSagas from './sagas/filters';
import * as eventsSagas from './sagas/events';
import * as seriesSagas from './sagas/series';
import * as searchSagas from './sagas/search';
import * as sourcesSagas from './sagas/sources';
import withPagination from './components/Pagination/withPagination';

import { tabs as eventsTabs } from './components/Sections/Events/MainPage';
import { tabs as lecturesTabs } from './components/Sections/Lectures/MainPage';
import PDF from './components/shared/PDF/PDF';

export const home = (store, match) => {
  store.dispatch(homeActions.fetchData());
  return Promise.resolve(null);
};

export const cuPage = (store, match) => {
  // TODO: fetch recommended content data as well
  store.dispatch(mdbActions.fetchUnit(match.params.id));
  return Promise.resolve(null);
};

const getExtraFetchParams = (ns, collectionID) => {
  switch (ns) {
  case 'programs':
    return { content_type: [CT_VIDEO_PROGRAM_CHAPTER] };
  case 'publications':
    return { content_type: [CT_ARTICLE] };
  case 'events-meals':
    return { content_type: [CT_MEAL] };
  case 'events-friends-gatherings':
    return { content_type: [CT_FRIENDS_GATHERING] };
  case 'lectures-virtual-lessons':
    return { content_type: [CT_VIRTUAL_LESSON] };
  case 'lectures-lectures':
    return { content_type: [CT_LECTURE] };
  case 'lectures-women-lessons':
    return { content_type: [CT_WOMEN_LESSON] };
  case 'lectures-children-lessons':
    return { content_type: [CT_CHILDREN_LESSON] };
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
  // TODO: fetch recommended content data as well
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
  // TODO: fetch recommended content data as well
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

export const lecturesPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || lecturesTabs[0];
  if (tab !== lecturesTabs[0]) {
    store.dispatch(lecturesActions.setTab(tab));
  }
  const ns = `lectures-${tab}`;

  return cuListPage(ns)(store, match);
};

export const seriesPage = (store, match) =>
  store.sagaMiddleWare.run(seriesSagas.fetchAll, seriesActions.fetchAll()).done;

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

      store.dispatch(searchActions.search(q, page, pageSize, deb));
    });

export const libraryPage = (store, match) => {
  // TODO: consider firstLeafID
  const sourceID = match.params.id;

  return store.sagaMiddleWare.run(sourcesSagas.fetchIndex, sourcesActions.fetchIndex(sourceID)).done
    .then(() => {
      const state    = store.getState();
      const { data } = sourcesSelectors.getIndexById(state.sources)[sourceID];
      if (!data) {
        return;
      }

      let language    = null;
      const uiLang    = settingsSelectors.getLanguage(state.settings);
      const languages = Array.from(Object.keys(data));
      if (languages.length > 0) {
        language = languages.indexOf(uiLang) === -1 ? languages[0] : uiLang;
      }

      if (data[language]) {
        if (data[language].pdf && PDF.isTaas(sourceID)) {
          return; // no need to fetch pdf. we don't do that on SSR
        }

        const name = data[language].html;
        store.dispatch(sourcesActions.fetchContent(sourceID, name));
      }
    });
};

export const publicationCUPage = (store, match) => {
  // TODO: fetch recommended content data as well
  const cuID = match.params.id;
  return store.sagaMiddleWare.run(mdbSagas.fetchUnit, mdbActions.fetchUnit(cuID)).done
    .then(() => {
      const state = store.getState();

      let language = null;
      const uiLang = settingsSelectors.getLanguage(state.settings);

      const unit      = mdbSelectors.getUnitById(state.mdb, cuID);
      const textFiles = (unit.files || []).filter(x => x.type === 'text' && x.mimetype !== MEDIA_TYPES.html.mime_type);
      const languages = uniq(textFiles.map(x => x.language));
      if (languages.length > 0) {
        language = languages.indexOf(uiLang) === -1 ? languages[0] : uiLang;
      }

      if (language) {
        const selected = textFiles.find(x => x.language === language) || textFiles[0];
        store.dispatch(assetsActions.doc2html(selected.id));
      }
    });
};
