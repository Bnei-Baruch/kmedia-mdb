import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../helpers/consts';
import { actions, selectors } from '../../../redux/modules/home';
import { actions as mdbActions, selectors as mdb } from '../../../redux/modules/mdb';
import { actions as publicationsActions, selectors as publications } from '../../../redux/modules/publications';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import HomePage from './HomePage';
import { withNamespaces } from 'react-i18next';

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

let timerHandle = null;

const handleRefresh = (fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner) => {
  fetchData();
  fetchSocialMedia('blog', fetchBlogList, language);
  fetchSocialMedia('twitter', fetchTweetsList, language);
  fetchBanner(language);
  fetchLatestLesson();
};

class HomePageContainer extends Component {
  static propTypes = {
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
    fetchLatestLesson: PropTypes.func.isRequired,
  };

  static defaultProps = {
    latestLesson: null,
    latestUnits: [],
    latestBlogPosts: [],
    latestTweets: [],
    wip: false,
    err: null,
  };

  componentDidMount() {
    const { fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner } = this.props;
    handleRefresh(fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner);
    timerHandle = setInterval(() => handleRefresh(fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner), 10 * 60 * 1000); // every 10 min

  }

  componentDidUpdate(prevProps) {
    const { fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner } = this.props;
    if (prevProps.language !== language) {
      if (timerHandle) {
        clearInterval(timerHandle);
      }
      handleRefresh(fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner);
      timerHandle = setInterval(() => handleRefresh(fetchData, fetchLatestLesson, fetchBlogList, language, fetchTweetsList, fetchBanner), 10 * 60 * 1000); // every 10 min
    }
  }

  render() {
    const
      {
        location,
        latestLesson,
        latestUnits,
        latestBlogPosts,
        latestTweets,
        banner,
        language,
        wip,
        err,
        t,
      } = this.props;

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
  }
}

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
  fetchLatestLesson: mdbActions.fetchLatestLesson,
}, dispatch);

export default connect(mapState, mapDispatch)(withNamespaces()(HomePageContainer));
