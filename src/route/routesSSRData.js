import uniq from 'lodash/uniq';
import moment from 'moment';
import { getPageFromLocation } from '../components/Pagination/withPagination';
import { tabs as publicationsTabs } from '../components/Sections/Publications/MainPage';
import {
  getFile as summaryGetFile,
  showSummaryTab,
  getSummaryLanguages
} from '../components/Pages/WithPlayer/widgets/UnitMaterials/Summary/helper';

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
  DEFAULT_CONTENT_LANGUAGE,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  PAGE_NS_EVENTS,
  PAGE_NS_LESSONS,
  PAGE_NS_PROGRAMS,
  RABASH_PERSON_UID,
  UNIT_PROGRAMS_TYPE,
  CT_RESEARCH_MATERIAL
} from '../helpers/consts';
import MediaHelper from './../helpers/media';
import { getQuery } from '../helpers/url';
import { canonicalCollection, isEmpty } from '../helpers/utils';
import { selectSuitableLanguage } from '../helpers/language';
import { actions as assetsActions } from '../redux/modules/assets';
import { actions as eventsActions } from './../redux/modules/events';
import { actions as filtersActions } from './../redux/modules/filters';
import { actions as homeActions } from './../redux/modules/home';
import { actions as listsActions } from './../redux/modules/lists';
import { actions as mdbActions } from './../redux/modules/mdb';
import { actions as musicActions } from './../redux/modules/music';
import { actions as prepareActions } from './../redux/modules/preparePage';
import { actions as publicationsActions } from './../redux/modules/publications';
import { actions as searchActions } from './../redux/modules/search';
import { selectors as settings } from './../redux/modules/settings';
import { actions as simpleModeActions } from './../redux/modules/simpleMode';
import { actions as sources } from './../redux/modules/sources';
import { actions as tagsActions } from './../redux/modules/tags';
import { actions as textPageActions } from '../redux/modules/textPage';
import * as eventsSagas from './../sagas/events';
import * as filtersSagas from './../sagas/filters';
import * as mdbSagas from './../sagas/mdb';
import * as musicSagas from './../sagas/music';
import * as publicationsSagas from './../sagas/publications';
import * as searchSagas from './../sagas/search';
import * as tagsSagas from './../sagas/tags';
import * as assetsSagas from './../sagas/assets';
import * as textPageSagas from './../sagas/textPage';
import { fetchSocialMedia } from '../components/Sections/Home/Container';
import Api from '../helpers/Api';
import {
  mdbGetDenormContentUnitSelector,
  textPageGetFileSelector,
  settingsGetContentLanguagesSelector,
  settingsGetUILangSelector,
  settingsGetPageSizeSelector,
  mdbGetCollectionByIdSelector,
  mdbGetLastLessonIdSelector,
  sourcesGetSourceByIdSelector
} from '../redux/selectors';
import { transcriptionFileFilter } from '../components/Pages/WithPlayer/widgets/UnitMaterials/Transcription/helper';

export const home = store => {
  const state            = store.getState();
  const contentLanguages = settingsGetContentLanguagesSelector(state);

  store.dispatch(homeActions.fetchData(true));
  fetchSocialMedia('blog', (type, id, options) => store.dispatch(publicationsActions.fetchBlogList(type, id, options)), contentLanguages);
  fetchSocialMedia('tweet', (type, id, options) => store.dispatch(publicationsActions.fetchTweets(type, id, options)), contentLanguages);
  store.dispatch(homeActions.fetchBanners(contentLanguages));

  return Promise.resolve(null);
};

export const cuPage = async (store, match) => {
  const cuID = match.params.id;
  if (cuID === '%3Canonymous%3E') {
    return Promise.resolve();
  }

  await store.sagaMiddleWare.run(mdbSagas.fetchUnit, mdbActions.fetchUnit(cuID)).done;

  const state = store.getState();

  const unit = mdbGetDenormContentUnitSelector(state, cuID);

  let activeTab = 'transcription';

  const contentLanguages = settingsGetContentLanguagesSelector(state);
  if (showSummaryTab(unit, contentLanguages)) {
    activeTab = 'summary';
  }

  if (match && match.parsedURL && match.parsedURL.searchParams) {
    for (const [key, value] of match.parsedURL.searchParams) {
      if (key === 'activeTab') {
        activeTab = value;
        break;
      }
    }
  }

  // Select transcript file by language.
  let { id } = unit;
  let file   = null;

  switch (activeTab) {
    case 'transcription':
      store.dispatch(textPageActions.setFileFilter(transcriptionFileFilter));
      await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id)).done;
      file = textPageGetFileSelector(store.getState());
      break;
    case 'research':
      id = Object.values(unit.derived_units).find(x => x.content_type === CT_RESEARCH_MATERIAL)?.id;
      await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id)).done;
      file = textPageGetFileSelector(store.getState());
      break;
    case 'articles':
      id = Object.values(unit.derived_units).find(x => x.content_type === CT_ARTICLE)?.id;
      await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id)).done;
      file = textPageGetFileSelector(store.getState());
      break;
    case 'summary':
      const summaryLanguages = getSummaryLanguages(unit);
      const summaryLanguage  = selectSuitableLanguage(contentLanguages, summaryLanguages, unit.original_language);
      file                   = summaryGetFile(unit, summaryLanguage);
      break;
    default:
      console.warn('Unsupported active tab', activeTab);
      break;
  }

  if (file && file.id) {
    await store.sagaMiddleWare.run(assetsSagas.doc2Html, assetsActions.doc2html(file.id)).done;
  }

  const c = canonicalCollection(unit);
  if (c) {
    store.dispatch(mdbActions.fetchCollection(c.id));
  }

  return true;
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

  const pageSize = settingsGetPageSizeSelector(store.getState());

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
      const [c] = mdbGetCollectionByIdSelector(store.getState(), [cID]);
      store.dispatch(mdbActions.fetchUnit(cuId || c?.cuIDs[0]));
    });
};

export const latestLesson = store => (store.sagaMiddleWare.run(mdbSagas.fetchLatestLesson).done
  .then(() => {
    const state = store.getState();
    const cID   = mdbGetLastLessonIdSelector(state);
    const [c]   = mdbGetCollectionByIdSelector(state, [cID]);
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
  const query = getQuery(match.parsedURL);
  const date  = (query.date && moment(query.date).isValid()) ? moment(query.date, 'YYYY-MM-DD').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

  store.dispatch(simpleModeActions.fetchForDate({ date }));
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
  store.sagaMiddleWare.run(filtersSagas.hydrateFilters, filtersActions.hydrateFilters('search')).done
]).then(() => store.dispatch(searchActions.search())));

function firstLeafId(sourceId, state) {
  const source = sourcesGetSourceByIdSelector(state)(sourceId);
  if (isEmpty(source?.children)) {
    return sourceId;
  }

  return firstLeafId(source.children[0], state);
}

const fetchSQData = async (store, uiLang, contentLanguages) => {
  let sourcesList;
  return await Api.sqdata({
    ui_language: uiLang,
    content_languages: contentLanguages
  }).then(({ data }) => {
    sourcesList = data.sources;
    store.dispatch(sources.receiveSources({ sources: sourcesList, uiLang }));
    store.dispatch(tagsActions.receiveTags(data.tags));
    store.dispatch(publicationsActions.receivePublishers(data.publishers));
    store.dispatch(mdbActions.receivePersons(data.persons));
    store.dispatch(mdbActions.fetchSQDataSuccess());
    return sourcesList;
  }).catch(err => store.dispatch(mdbActions.fetchSQDataFailure(err)));
};

export const libraryPage = async (store, match, show_console = false) => {
  show_console = true;

  const state            = store.getState();
  const location         = state?.router.location ?? {};
  const query            = getQuery(location);
  const uiLang           = query.language || settings.getUILang(state.settings);
  const sourceLanguage   = query.source_language;
  const contentLanguages = settingsGetContentLanguagesSelector(state);
  show_console && console.log('serverRender: libraryPage before fetch sources');
  await fetchSQData(store, uiLang, contentLanguages);

  show_console && console.log('serverRender: libraryPage sources was fetched', match.params.id);
  const sourceID = firstLeafId(match.params.id, store.getState());
  show_console && console.log('serverRender: libraryPage source was found', sourceID);

  await store.sagaMiddleWare.run(textPageSagas.fetchSubject, textPageActions.fetchSubject(sourceID, sourceLanguage)).done;
  const file = textPageGetFileSelector(store.getState()) || {};

  if (!file.isPdf) {
    await store.sagaMiddleWare.run(assetsSagas.doc2Html, assetsActions.doc2html(file.id)).done;
    store.dispatch(mdbActions.fetchLabels({ content_unit: sourceID, language: file.language }));
  }
};

const TWEETER_USERTNAMES_BY_LANG = new Map([
  [LANG_HEBREW, 'laitman_co_il'],
  [LANG_UKRAINIAN, 'Michael_Laitman'],
  [LANG_RUSSIAN, 'Michael_Laitman'],
  [LANG_SPANISH, 'laitman_es'],
  [LANG_ENGLISH, 'laitman']
]);

export const likutPage = async (store, match, show_console = false) => {
  const { id } = match.params;

  const location       = store.getState()?.router.location ?? {};
  const query          = getQuery(location);
  const sourceLanguage = query.source_language;

  return store.sagaMiddleWare
    .run(textPageSagas.fetchSubject, textPageActions.fetchSubject(id, sourceLanguage))
    .done
    .then(() => {
      const state  = store.getState();
      const uiLang = query.language || settingsGetUILangSelector(state);
      const file   = textPageGetFileSelector(state) || {};

      store.dispatch(assetsActions.doc2html(file.id));
      store.dispatch(mdbActions.fetchLabels({ content_unit: id, language: uiLang }));
    });
};

export const tweetsListPage = (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters('publications-twitter'));

  // hydrate page
  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(publicationsActions.setPage('publications-twitter', page));

  const state = store.getState();

  const pageSize         = settingsGetPageSizeSelector(state);
  const contentLanguages = settingsGetContentLanguagesSelector(state);
  // Array of usernames.
  const username         = Array.from(new Set(contentLanguages.map(contentLanguage =>
    TWEETER_USERTNAMES_BY_LANG.get(contentLanguage) || TWEETER_USERTNAMES_BY_LANG.get(DEFAULT_CONTENT_LANGUAGE))));
  // dispatch fetchData
  store.dispatch(publicationsActions.fetchTweets('publications-twitter', page, { username, pageSize }));

  return Promise.resolve(null);
};

export const topicsPage = (store, match) => {
  const tagID = match.params.id;
  return Promise.all([
    store.sagaMiddleWare.run(tagsSagas.fetchDashboard, tagsActions.fetchDashboard(tagID)).done
    // store.sagaMiddleWare.run(tagsSagas.fetchTags, tagsActions.fetchTags).done
  ]);
};

const BLOG_BY_LANG = new Map([
  [LANG_HEBREW, 'laitman-co-il'],
  [LANG_UKRAINIAN, 'laitman-ru'],
  [LANG_RUSSIAN, 'laitman-ru'],
  [LANG_SPANISH, 'laitman-es'],
  [LANG_ENGLISH, 'laitman-com']
]);

export const blogListPage = (store, match) => {
  // hydrate filters
  store.dispatch(filtersActions.hydrateFilters('publications-blog'));

  // hydrate page
  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(publicationsActions.setPage('publications-blog', page));

  const state = store.getState();

  const pageSize         = settingsGetPageSizeSelector(state);
  const contentLanguages = settingsGetContentLanguagesSelector(state);
  // Array of blogs.
  const blog             = Array.from(new Set(contentLanguages.map(contentLanguage =>
    BLOG_BY_LANG.get(contentLanguage) || BLOG_BY_LANG.get(DEFAULT_CONTENT_LANGUAGE))));

  // dispatch fetchData
  store.dispatch(publicationsActions.fetchBlogList('publications-blog', page, { blog, pageSize }));

  return Promise.resolve(null);
};

export const publicationsPage = (store, match) => {
  // hydrate tab
  const tab = match.params.tab || publicationsTabs[0];
  const ns  = `publications-${tab}`;

  if (tab !== publicationsTabs[0]) {
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
      const uiLang = settingsGetUILangSelector(state);

      const unit = mdbGetDenormContentUnitSelector(state, cuID);
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
