import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
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
  [LANG_HEBREW, { username: 'laitman_co_il' }],
  [LANG_UKRAINIAN, { username: 'Michael_Laitman' }],
  [LANG_RUSSIAN, { username: 'Michael_Laitman' }],
  [LANG_SPANISH, { username: 'laitman_es' }],
  [LANG_ENGLISH, { username: 'laitman' }],
]);

const BLOG_BY_LANG = new Map([
  [LANG_HEBREW, { blog: 'laitman-co-il' }],
  [LANG_UKRAINIAN, { blog: 'laitman-ru' }],
  [LANG_RUSSIAN, { blog: 'laitman-ru' }],
  [LANG_SPANISH, { blog: 'laitman-es' }],
  [LANG_ENGLISH, { blog: 'laitman-com' }],
]);

const chooseSocialMediaByLanguage = (contentLanguages, socialMediaOptions) =>
  socialMediaOptions.get(contentLanguages.find(language => socialMediaOptions.has(language)) || DEFAULT_CONTENT_LANGUAGE);

const fetchSocialMedia = (type, fetchFn, contentLanguages) => {
  fetchFn(`publications-${type}`, 1, {
    page_size: 4,
    ...chooseSocialMediaByLanguage(contentLanguages, type === 'blog' ? BLOG_BY_LANG : TWITTER_BY_LANG),
  });
};

const getHome = state => state.home;
const getPublications = state => state.publications;
const getSettings = state => state.settings;
const getMDB = state => state.mdb;
const getLatestLessonID = (_, latestLessonID) => latestLessonID;
const getLatestUnitIDs = (_, latestUnitIDs) => latestUnitIDs;
const getLatestCoIDs = (_, latestCoIDs) => latestCoIDs;

const latestLessonIDFn = createSelector([getHome], home => selectors.getLatestLesson(home));
const latestLessonFn = createSelector(getMDB, getLatestLessonID,
  (m, latestLessonID) => latestLessonID ? mdb.getCollectionById(m, latestLessonID) : null
);
const latestUnitIDsFn = createSelector([getHome], home => selectors.getLatestUnits(home));
const latestUnitsFn = createSelector(getMDB, getLatestUnitIDs,
  (m, latestUnitIDs) => Array.isArray(latestUnitIDs) ? latestUnitIDs.map(x => mdb.getDenormContentUnit(m, x)) : []
);
const latestBlogPostsFn = createSelector([getPublications], pubs => publications.getBlogPosts(pubs));
const latestTweetsFn = createSelector([getPublications], pubs => publications.getTweets(pubs));
const contentLanguagesFn = createSelector([getSettings], s => settings.getContentLanguages(s));
const uiLangFn = createSelector([getSettings], s => settings.getUILang(s));
const wipFn = createSelector([getHome], home => selectors.getWip(home));
const errFn = createSelector([getHome], home => selectors.getError(home));
const latestCoIDsFn = createSelector([getHome], home => selectors.getLatestCos(home));
const latestCosFn = createSelector(getMDB, getLatestCoIDs,
  (m, latestCoIDs) => latestCoIDs.map(x => mdb.getDenormCollection(m, x))
);

const HomePageContainer = ({ t }) => {
  const dispatch = useDispatch();
  const fetchData = useCallback(flag => dispatch(actions.fetchData(flag)), [dispatch]);

  const latestLessonID = useSelector(latestLessonIDFn);
  const latestLesson = useSelector(state => latestLessonFn(state, latestLessonID));

  const latestUnitIDs = useSelector(latestUnitIDsFn);
  const latestUnits = useSelector(state => latestUnitsFn(state, latestUnitIDs));
  const latestCoIDs = useSelector(latestCoIDsFn) || [];
  const latestCos = useSelector(state => latestCosFn(state, latestCoIDs));

  const fetchBlogList = useCallback((type, id, options) => dispatch(publicationsActions.fetchBlogList(type, id, options)), [dispatch]);
  const latestBlogPosts = useSelector(latestBlogPostsFn);

  const fetchTweetsList = useCallback((type, id, options) => dispatch(publicationsActions.fetchTweets(type, id, options)), [dispatch]);
  const latestTweets = useSelector(latestTweetsFn);

  const fetchBanners = useCallback(contentLanguages => dispatch(actions.fetchBanners(contentLanguages)), [dispatch]);
  const uiLang = useSelector(uiLangFn);
  const contentLanguages = useSelector(contentLanguagesFn);
  const wip = useSelector(wipFn);
  const err = useSelector(errFn);

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
