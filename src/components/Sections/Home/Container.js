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
  DEFAULT_CONTENT_LANGUAGE
} from '../../../helpers/consts';
import { actions } from '../../../redux/modules/home';
import { actions as publicationsActions } from '../../../redux/modules/publications';
import WipErr from '../../shared/WipErr/WipErr';
import HomePage from './HomePage';
import {
  homeErrSelector,
  homeFetchTimestampSelector,
  homeLatestCoIDsSelector,
  homeLatestLessonIDSelector,
  homeLatestUnitIDsSelector,
  homeWipSelector,
  mdbLatestCosSelector,
  mdbLatestLessonSelector,
  mdbLatestUnitsSelector,
  publicationsLatestBlogPostsSelector,
  publicationsLatestTweetsSelector,
  settingsGetContentLanguagesSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';

const FETCH_TIMEOUT = 10 * 60 * 1000; // every 10 min

const TWITTER_BY_LANG = new Map([
  [LANG_HEBREW, { username: 'laitman_co_il' }],
  [LANG_UKRAINIAN, { username: 'Michael_Laitman' }],
  [LANG_RUSSIAN, { username: 'Michael_Laitman' }],
  [LANG_SPANISH, { username: 'laitman_es' }],
  [LANG_ENGLISH, { username: 'laitman' }]
]);

const BLOG_BY_LANG = new Map([
  [LANG_HEBREW, { blog: 'laitman-co-il' }],
  [LANG_UKRAINIAN, { blog: 'laitman-ru' }],
  [LANG_RUSSIAN, { blog: 'laitman-ru' }],
  [LANG_SPANISH, { blog: 'laitman-es' }],
  [LANG_ENGLISH, { blog: 'laitman-com' }]
]);

const chooseSocialMediaByLanguage = (contentLanguages, socialMediaOptions) =>
  socialMediaOptions.get(contentLanguages.find(language => socialMediaOptions.has(language)) || DEFAULT_CONTENT_LANGUAGE);

export const fetchSocialMedia = (type, fetchFn, contentLanguages) => {
  fetchFn(`publications-${type}`, 1, {
    page_size: 4,
    ...chooseSocialMediaByLanguage(contentLanguages, type === 'blog' ? BLOG_BY_LANG : TWITTER_BY_LANG)
  });
};

const HomePageContainer = ({ t }) => {
  const dispatch  = useDispatch();
  const fetchData = useCallback(flag => dispatch(actions.fetchData(flag)), [dispatch]);

  const fetchTimestamp = useSelector(homeFetchTimestampSelector);

  const latestLessonID = useSelector(homeLatestLessonIDSelector);
  const latestLesson   = useSelector(state => mdbLatestLessonSelector(state, latestLessonID));

  const latestUnitIDs = useSelector(homeLatestUnitIDsSelector);
  const latestUnits   = useSelector(state => mdbLatestUnitsSelector(state, latestUnitIDs));
  const latestCoIDs   = useSelector(homeLatestCoIDsSelector) || [];
  const latestCos     = useSelector(state => mdbLatestCosSelector(state, latestCoIDs));

  const fetchBlogList   = useCallback((type, id, options) => dispatch(publicationsActions.fetchBlogList(type, id, options)), [dispatch]);
  const latestBlogPosts = useSelector(publicationsLatestBlogPostsSelector);

  const fetchTweetsList = useCallback((type, id, options) => dispatch(publicationsActions.fetchTweets(type, id, options)), [dispatch]);
  const latestTweets    = useSelector(publicationsLatestTweetsSelector);

  const fetchBanners     = useCallback(contentLanguages => dispatch(actions.fetchBanners(contentLanguages)), [dispatch]);
  const uiLang           = useSelector(settingsGetUILangSelector);
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const wip              = useSelector(homeWipSelector);
  const err              = useSelector(homeErrSelector);

  useEffect(() => {
    const now = Date.now();
    console.log('re-fetch', fetchTimestamp, now, FETCH_TIMEOUT);
    if (!fetchTimestamp || now - fetchTimestamp > FETCH_TIMEOUT) {
      console.log('Fetching!');
      fetchData(true);
      fetchSocialMedia('blog', fetchBlogList, contentLanguages);
      fetchSocialMedia('tweet', fetchTweetsList, contentLanguages);
      fetchBanners(contentLanguages);
    }
  }, [fetchTimestamp, contentLanguages, fetchBanners, fetchBlogList, fetchData, fetchTweetsList]);

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
