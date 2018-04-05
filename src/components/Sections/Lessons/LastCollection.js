import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { translate } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import { PlaylistCollectionContainer } from '../../Pages/PlaylistCollection/Container';

import Helmets from "../../shared/Helmets";

class LastLessonCollection extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    lastLessonId: PropTypes.string,
    wip: shapes.WipMap.isRequired,
    errors: shapes.ErrorsMap.isRequired,
    language: PropTypes.string.isRequired,
    fetchLatestLesson: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastLessonId: '',
  };

  componentDidMount() {
    if (!this.props.lastLessonId) {
      this.props.fetchLatestLesson();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      nextProps.fetchLatestLesson();
    }
  }

  render() {
    const { wip, errors, t, lastLessonId, language } = this.props;

    const wipErr = WipErr({ wip: wip.lastLesson, err: errors.lastLesson, t });
    if (wipErr) {
      return wipErr;
    }

    if (!lastLessonId) {
      return null;
    }

    const props = {
      ...this.props,
      match: {
        ...this.props.match,
        params: {
          language,
          id: lastLessonId,
        }
      },
      shouldRenderHelmet: false,
    };

    // TODO (orin): is this the right place for the helmet?
    return (
      <div>
        <Helmets.Basic title={t('lessons.last.text')} description={t('lessons.header.subtext')} />

        {/*<Helmets.Image unitOrUrl="https://archive.kbb1.com/images/hp_lesson_temp.jpg" />*/}
        <PlaylistCollectionContainer {...props} />
      </div>
    );
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
