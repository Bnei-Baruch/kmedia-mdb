import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

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

const HomePageContainer = (props) => {
  const
    {
      location,
      fetchData, latestLesson = null, latestUnits = [],
      fetchBlogList, latestBlogPosts              = [],
      fetchTweetsList, latestTweets               = [],
      banner, fetchBanner,
      language,
      wip                                         = false,
      err                                         = null,
      t,
    } = props;

  useEffect(() => {
    fetchData(true);
    fetchSocialMedia('blog', fetchBlogList, language);
    fetchSocialMedia('tweet', fetchTweetsList, language);
    fetchBanner(language);
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

const mapState = (state) => {
  return {
    latestLessonID: selectors.getLatestLesson(state.home),
    latestLesson: selectors.getLatestLesson(state.home) ? mdb.getCollectionById(state.mdb, selectors.getLatestLesson(state.home)) : null,
    latestUnitIDs: selectors.getLatestUnits(state.home),
    latestUnits: Array.isArray(selectors.getLatestUnits(state.home))
      ? selectors.getLatestUnits(state.home).map(x => mdb.getDenormContentUnit(state.mdb, x))
      : [],
    banner: selectors.getBanner(state.home),
    wip: selectors.getWip(state.home),
    err: selectors.getError(state.home),
    latestBlogPosts: publications.getBlogPosts(state.publications),
    latestTweets: publications.getTweets(state.publications),
    language: settings.getLanguage(state.settings)
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchData: actions.fetchData,
  fetchBlogList: publicationsActions.fetchBlogList,
  fetchTweetsList: publicationsActions.fetchTweets,
  fetchBanner: actions.fetchBanner,
}, dispatch);

HomePageContainer.propTypes = {
  location: shapes.HistoryLocation.isRequired,
  latestLesson: shapes.LessonCollection,
  latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
  latestBlogPosts: PropTypes.arrayOf(shapes.BlogPost),
  latestTweets: PropTypes.arrayOf(shapes.Tweet),
  banner: shapes.Banner.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  language: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  fetchBlogList: PropTypes.func.isRequired,
  fetchTweetsList: PropTypes.func.isRequired,
  fetchBanner: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(withNamespaces()(HomePageContainer));
