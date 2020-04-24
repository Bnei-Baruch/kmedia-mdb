import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../helpers/consts';
import { actions, selectors } from '../../../redux/modules/home';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions as publicationsActions, selectors as publications } from '../../../redux/modules/publications';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import HomePage from './HomePage';
import { useInterval } from '../../../helpers/timer';

const FETCH_TIMEOUT = 10 * 60 * 1000;// every 10 min

const chooseTwitterByLanguage = (language) => {
  switch (language) {
  case LANG_HEBREW:
    return { username: 'laitman_co_il' };
  case LANG_UKRAINIAN:
  case LANG_RUSSIAN:
    return { username: 'Michael_Laitman' };
  case LANG_SPANISH:
    return { username: 'laitman_es' };
  default:
    return { username: 'laitman' };
  }
};

const chooseBlogByLanguage = (language) => {
  switch (language) {
  case LANG_HEBREW:
    return { blog: 'laitman-co-il' };
  case LANG_UKRAINIAN:
  case LANG_RUSSIAN:
    return { blog: 'laitman-ru' };
  case LANG_SPANISH:
    return { blog: 'laitman-es' };
  default:
    return { blog: 'laitman-com' };
  }
};

const fetchSocialMedia = (type, fetchFn, language) => {
  let mediaLanguageFn;
  if (type === 'blog') {
    mediaLanguageFn = chooseBlogByLanguage;
  } else {
    mediaLanguageFn = chooseTwitterByLanguage;
  }

  fetchFn(`publications-${type}`, 1, {
    page_size: 4,
    ...mediaLanguageFn(language)
  });
};

const HomePageContainer = ({ location }) => {
  const { t }           = useTranslation('common', { useSuspense: false });
  const dispatch        = useDispatch();
  const fetchData       = useCallback(flag => dispatch(actions.fetchData(flag)), [dispatch]);
  const fetchBlogList   = useCallback((type, id, options) => dispatch(publicationsActions.fetchBlogList(type, id, options)), [dispatch]);
  const fetchTweetsList = useCallback((type, id, options) => dispatch(publicationsActions.fetchTweets(type, id, options)), [dispatch]);
  const latestLessonID  = useSelector(state => selectors.getLatestLesson(state.home));
  const latestLesson    = useSelector(state => latestLessonID ? mdb.getCollectionById(state.mdb, latestLessonID) : null);
  const latestUnitIDs   = useSelector(state => selectors.getLatestUnits(state.home));
  const latestUnits     = useSelector(state => Array.isArray(latestUnitIDs) ? latestUnitIDs.map(x => mdb.getDenormContentUnit(state.mdb, x)) : [], [latestUnitIDs]);
  const banner          = useSelector(state => selectors.getBanner(state.home));
  const wip             = useSelector(state => selectors.getWip(state.home));
  const err             = useSelector(state => selectors.getError(state.home));
  const latestBlogPosts = useSelector(state => publications.getBlogPosts(state.publications));
  const latestTweets    = useSelector(state => publications.getTweets(state.publications));
  const language        = useSelector(state => settings.getLanguage(state.settings));

  useEffect(() => {
    fetchData(true);
    fetchSocialMedia('blog', fetchBlogList, language);
    fetchSocialMedia('tweet', fetchTweetsList, language);
    dispatch(actions.fetchBanner(language));
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  useInterval(() => fetchData(false), FETCH_TIMEOUT);

  return (
    <HomePage
      location={location}
      latestLesson={latestLesson}
      latestUnits={latestUnits}
      latestBlogPosts={latestBlogPosts}
      latestTweets={latestTweets}
      banner={banner}
      language={language}
      wip={wip}
      err={err}
      t={t}
    />
  );
};

HomePageContainer.propTypes = {
  location: shapes.HistoryLocation.isRequired,
};

export default HomePageContainer;
