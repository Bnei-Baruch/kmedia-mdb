import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/home';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions as publicationsActions, selectors as publications } from '../../../redux/modules/publications';
import { selectors as settings } from '../../../redux/modules/settings';
import { LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN } from '../../../helpers/consts';
import * as shapes from '../../shapes';
import HomePage from './HomePage';

class HomePageContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    latestLesson: shapes.LessonCollection,
    latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
    latestBlogPosts: PropTypes.arrayOf(shapes.BlogPost),
    latestTweets: PropTypes.arrayOf(shapes.Tweet),
    banner: shapes.Banner,
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
    fetchBlogList: PropTypes.func.isRequired,
    fetchTweetsList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    latestLesson: null,
    latestUnits: [],
    latestBlogPosts: [],
    latestTweets: [],
    banner: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    if (!this.props.latestLesson) {
      this.props.fetchData();
    }
    if (!this.props.latestBlogPosts.length) {
      this.fetchSocialMedia('publications-blog', this.chooseBlogByLanguage);
    }
    if (!this.props.latestTweets.length) {
      this.fetchSocialMedia('publications-twitter', this.chooseTwitterByLanguage);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.props.fetchData();
      this.fetchSocialMedia('publications-blog', this.chooseBlogByLanguage, nextProps);
      this.fetchSocialMedia('publications-twitter', this.chooseTwitterByLanguage, nextProps);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  chooseTwitterByLanguage = (language) => {
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

  // eslint-disable-next-line class-methods-use-this
  chooseBlogByLanguage = (language) => {
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

  fetchSocialMedia(nameSpace, mediaLanguage, nextProps = {}) {
    const pageNumber = 1;
    const language   = nextProps.language || this.props.language;
    const extraArgs  = {
      page_size: 4,
      ...mediaLanguage(language)
    };
    (nameSpace === 'publications-blog') ?
      this.props.fetchBlogList(nameSpace, pageNumber, extraArgs) :
      this.props.fetchTweetsList(nameSpace, pageNumber, extraArgs);
  }

  render() {
    const { location, latestLesson, latestUnits, latestBlogPosts, latestTweets, banner, language, wip, err, } = this.props;

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
      />
    );
  }
}

const mapState = (state) => {
  const latestLessonID = selectors.getLatestLesson(state.home);
  const latestLesson   = latestLessonID ? mdb.getCollectionById(state.mdb, latestLessonID) : null;

  const latestUnitIDs = selectors.getLatestUnits(state.home);
  const latestUnits   = Array.isArray(latestUnitIDs) ?
    latestUnitIDs.map(x => mdb.getDenormContentUnit(state.mdb, x)) :
    [];
  return {
    latestLesson,
    latestUnits,
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
}, dispatch);

export default connect(mapState, mapDispatch)(HomePageContainer);
