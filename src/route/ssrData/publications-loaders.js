import uniq from 'lodash/uniq';
import { actions as publicationsActions } from '../../redux/modules/publications';
import { actions as filtersActions } from '../../redux/modules/filters';
import { actions as assetsActions } from '../../redux/modules/assets';
import { actions as mdbActions } from '../../redux/modules/mdb';
import {
  mdbGetDenormContentUnitSelector,
  settingsGetUILangSelector,
  settingsGetPageSizeSelector,
  settingsGetContentLanguagesSelector
} from '../../redux/selectors';
import * as mdbSagas from '../../sagas/mdb';
import * as publicationsSagas from '../../sagas/publications';
import MediaHelper from '../../helpers/media';
import { canonicalCollection } from '../../helpers/utils';
import { getPageFromLocation } from '../../components/Pagination/withPagination';
import { tabs as publicationsTabs } from '../../components/Sections/Publications/MainPage';
import { cuListPage } from './list-loaders';
import {
  CT_ARTICLE,
  DEFAULT_CONTENT_LANGUAGE,
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN
} from '../../helpers/consts';

const TWITTER_USERNAMES_BY_LANG = new Map([
  [LANG_HEBREW, 'laitman_co_il'],
  [LANG_UKRAINIAN, 'Michael_Laitman'],
  [LANG_RUSSIAN, 'Michael_Laitman'],
  [LANG_SPANISH, 'laitman_es'],
  [LANG_ENGLISH, 'laitman']
]);

const BLOG_BY_LANG = new Map([
  [LANG_HEBREW, 'laitman-co-il'],
  [LANG_UKRAINIAN, 'laitman-ru'],
  [LANG_RUSSIAN, 'laitman-ru'],
  [LANG_SPANISH, 'laitman-es'],
  [LANG_ENGLISH, 'laitman-com']
]);

/**
 * SSR data loader for tweets list page
 */
export const tweetsListPage = (store, match) => {
  store.dispatch(filtersActions.hydrateFilters('publications-twitter'));

  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(publicationsActions.setPage('publications-twitter', page));

  const state = store.getState();
  const pageSize = settingsGetPageSizeSelector(state);
  const contentLanguages = settingsGetContentLanguagesSelector(state);
  
  const username = Array.from(new Set(contentLanguages.map(contentLanguage =>
    TWITTER_USERNAMES_BY_LANG.get(contentLanguage) || TWITTER_USERNAMES_BY_LANG.get(DEFAULT_CONTENT_LANGUAGE))));

  store.dispatch(publicationsActions.fetchTweets('publications-twitter', page, { username, pageSize }));

  return Promise.resolve(null);
};

/**
 * SSR data loader for blog list page
 */
export const blogListPage = (store, match) => {
  store.dispatch(filtersActions.hydrateFilters('publications-blog'));

  const page = getPageFromLocation(match.parsedURL);
  store.dispatch(publicationsActions.setPage('publications-blog', page));

  const state = store.getState();
  const pageSize = settingsGetPageSizeSelector(state);
  const contentLanguages = settingsGetContentLanguagesSelector(state);
  
  const blog = Array.from(new Set(contentLanguages.map(contentLanguage =>
    BLOG_BY_LANG.get(contentLanguage) || BLOG_BY_LANG.get(DEFAULT_CONTENT_LANGUAGE))));

  store.dispatch(publicationsActions.fetchBlogList('publications-blog', page, { blog, pageSize }));

  return Promise.resolve(null);
};

/**
 * SSR data loader for publications main page
 */
export const publicationsPage = (store, match) => {
  const tab = match.params.tab || publicationsTabs[0];
  const ns = `publications-${tab}`;

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

/**
 * SSR data loader for article content unit page
 */
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

/**
 * SSR data loader for blog post page
 */
export const blogPostPage = (store, match) => {
  const { blog, id } = match.params;
  return store.sagaMiddleWare.run(publicationsSagas.fetchBlogPost, publicationsActions.fetchBlogPost(blog, id)).done;
};

/**
 * Extra fetch params for publications
 */
export const getPublicationsExtraParams = (ns) => {
  if (ns === 'publications-articles') {
    return { content_type: [CT_ARTICLE] };
  }
  return {};
};

