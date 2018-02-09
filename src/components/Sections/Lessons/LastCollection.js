import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { translate } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import WipErr from '../../shared/WipErr/WipErr';
import { PlaylistCollectionContainer } from '../../Pages/PlaylistCollection/Container';

class LastLessonCollection extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.fetchLatestLesson();
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      nextProps.fetchLatestLesson();
    }
  }

  render() {
    const { wip, err, t, lastLessonId, language } = this.props;

    const wipErr = WipErr({ wip: wip.lastLesson, err, t });
    if (wipErr) {
      return wipErr;
    }

    const props = {
      ...this.props,
      match: {
        ...this.props.match,
        params: {
          language,
          id: lastLessonId,
        }
      }
    };

    return <PlaylistCollectionContainer {...props} />;
  }
}

function mapState(state) {
  const lastLessonId = selectors.getLastLessonId(state.mdb);
  const collection   = selectors.getDenormCollectionWUnits(state.mdb, lastLessonId);
  return {
    collection,
    lastLessonId,
    wip: selectors.getWip(state.mdb),
    errors: selectors.getErrors(state.mdb),
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchLatestLesson: actions.fetchLatestLesson,
    fetchCollection: actions.fetchCollection,
    fetchUnit: actions.fetchUnit,
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(translate()(LastLessonCollection)));
