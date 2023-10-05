import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { useInterval } from '../../../helpers/timer';
import {
  LANG_ENGLISH,
  LANG_HEBREW,
  LANG_RUSSIAN,
  LANG_SPANISH,
  LANG_UKRAINIAN,
  DEFAULT_CONTENT_LANGUAGE,
} from '../../../helpers/consts';
import { actions, selectors } from '../../../redux/modules/home';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions as publicationsActions, selectors as publications } from '../../../redux/modules/publications';
import { selectors as settings } from '../../../redux/modules/settings';
import WipErr from '../../shared/WipErr/WipErr';
import HomePage from './HomePage';

const FETCH_TIMEOUT = 10 * 60 * 1000; // every 10 min

const TWITTER_BY_LANG = new Map([
  [LANG_HEBREW,    { username: 'laitman_co_il' }],
  [LANG_UKRAINIAN, { username: 'Michael_Laitman' }],
  [LANG_RUSSIAN,   { username: 'Michael_Laitman' }],
  [LANG_SPANISH,   { username: 'laitman_es' }],
  [LANG_ENGLISH,   { username: 'laitman' }],
]);

const BLOG_BY_LANG = new Map([
  [LANG_HEBREW,    { blog: 'laitman-co-il' }],
  [LANG_UKRAINIAN, { blog: 'laitman-ru' }],
  [LANG_RUSSIAN,   { blog: 'laitman-ru' }],
  [LANG_SPANISH,   { blog: 'laitman-es' }],
  [LANG_ENGLISH,   { blog: 'laitman-com' }],
]);

const chooseSocialMediaByLanguage = (contentLanguages, socialMediaOptions) =>
  socialMediaOptions.get(contentLanguages.find(language => socialMediaOptions.has(language)) || DEFAULT_CONTENT_LANGUAGE);

const fetchSocialMedia = (type, fetchFn, contentLanguages) => {
  fetchFn(`publications-${type}`, 1, {
    page_size: 4,
    ...chooseSocialMediaByLanguage(contentLanguages, type === 'blog' ? BLOG_BY_LANG : TWITTER_BY_LANG),
  });
};

const latestLessonIDFn   = state => selectors.getLatestLesson(state.home);
const latestLessonFn     = latestLessonID => state => latestLessonID ? mdb.getCollectionById(state.mdb, latestLessonID) : null;
const latestUnitIDsFn    = state => selectors.getLatestUnits(state.home);
const latestUnitsFn      = latestUnitIDs => state => Array.isArray(latestUnitIDs) ? latestUnitIDs.map(x => mdb.getDenormContentUnit(state.mdb, x)) : [];
const latestBlogPostsFn  = state => publications.getBlogPosts(state.publications);
const latestTweetsFn     = state => publications.getTweets(state.publications);
const contentLanguagesFn = state => settings.getContentLanguages(state.settings);
const wipFn              = state => selectors.getWip(state.home);
const errFn              = state => selectors.getError(state.home);

const HomePageContainer = ({ t }) => {
  const dispatch  = useDispatch();
  const fetchData = useCallback(flag => dispatch(actions.fetchData(flag)), [dispatch]);

  const latestLessonID = useSelector(latestLessonIDFn);
  const latestLesson   = useSelector(latestLessonFn(latestLessonID));

  const latestUnitIDs = useSelector(latestUnitIDsFn);
  const latestUnits   = useSelector(latestUnitsFn(latestUnitIDs));
  const latestCoIDs   = useSelector(state => selectors.getLatestCos(state.home)) || [];
  const latestCos     = useSelector(state => latestCoIDs.map(x => mdb.getDenormCollection(state.mdb, x)));

  const fetchBlogList   = useCallback((type, id, options) => dispatch(publicationsActions.fetchBlogList(type, id, options)), [dispatch]);
  const latestBlogPosts = useSelector(latestBlogPostsFn);

  const fetchTweetsList = useCallback((type, id, options) => dispatch(publicationsActions.fetchTweets(type, id, options)), [dispatch]);
  const latestTweets    = useSelector(latestTweetsFn);

  const fetchBanners     = useCallback(contentLanguages => dispatch(actions.fetchBanners(contentLanguages)), [dispatch]);
  const uiLang           = useSelector(state => settings.getUILang(state.settings));
  const contentLanguages = useSelector(contentLanguagesFn);
  const wip              = useSelector(wipFn);
  const err              = useSelector(errFn);

  useEffect(() => {
    console.log('re-fetch');
    fetchData(true);
    fetchSocialMedia('blog', fetchBlogList, contentLanguages);
    fetchSocialMedia('tweet', fetchTweetsList, contentLanguages);
    fetchBanners(contentLanguages);
  }, [contentLanguages, fetchBanners, fetchBlogList, fetchData, fetchTweetsList]);

  useInterval(() => fetchData(false), FETCH_TIMEOUT);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return null;
  }

  return (
    <HomePage
      uiLang={uiLang}
      latestLesson={latestLesson}
      latestItems={[...latestUnits, ...latestCos]}
      latestBlogPosts={latestBlogPosts}
      latestTweets={latestTweets}
    />
  );
};

HomePageContainer.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation()(HomePageContainer);
