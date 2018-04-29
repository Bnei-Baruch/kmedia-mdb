import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/home';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import HomePage from './HomePage';

class HomePageContainer extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    latestLesson: shapes.LessonCollection,
    latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
    banner: shapes.Banner,
    wip: shapes.WIP,
    err: shapes.Error,
    language: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    latestLesson: null,
    latestUnits: [],
    banner: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    if (!this.props.latestLesson) {
      this.props.fetchData();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language) {
      this.props.fetchData();
    }
  }

  render() {
    const { location, latestLesson, latestUnits, banner, wip, err, } = this.props;

    return (
      <HomePage
        location={location}
        latestLesson={latestLesson}
        latestUnits={latestUnits}
        banner={banner}
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
    language: settings.getLanguage(state.settings)
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchData: actions.fetchData,
}, dispatch);

export default connect(mapState, mapDispatch)(HomePageContainer);
