import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { actions, selectors } from '../../../../redux/modules/mdb';
import { selectors as settings } from '../../../../redux/modules/settings';
import * as shapes from '../../../shapes';
import Helmets from '../../../shared/Helmets';
import WipErr from '../../../shared/WipErr/WipErr';
import { PlaylistCollectionContainer } from '../../../Pages/PlaylistCollection/Container';
import { publicFile } from '../../../../helpers/utils';

class LastLessonCollection extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    lastLessonId: PropTypes.string,
    wip: shapes.WipMap.isRequired,
    errors: shapes.ErrorsMap.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    fetchLatestLesson: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    fetchWindow: PropTypes.func.isRequired,
    cWindow: shapes.cWindow.isRequired,
  };

  static defaultProps = {
    lastLessonId: '',
  };

  componentDidMount() {
    this.props.fetchLatestLesson();
  }

  shouldComponentUpdate(nextProps) {
    const { uiLanguage, contentLanguage, wip, errors, lastLessonId } = nextProps;
    const { props }                                                  = this;

    return (
      (lastLessonId && (lastLessonId !== props.lastLessonId))
      || uiLanguage !== props.uiLanguage
      || contentLanguage !== props.contentLanguage
      || !isEqual(wip, props.wip)
      || !isEqual(errors, props.errors)
    );
  }

  componentDidUpdate(prevProps) {
    const { lastLessonId, uiLanguage, contentLanguage, fetchLatestLesson } = this.props;

    if (!lastLessonId
      && (uiLanguage !== prevProps.uiLanguage
        || contentLanguage !== prevProps.contentLanguage)
    ) {
      fetchLatestLesson();
    }
  }

  render() {
    const { wip, errors, t, lastLessonId, contentLanguage } = this.props;

    const wipErr = WipErr({ wip: wip.lastLesson, err: errors.lastLesson, t });

    if (wipErr) {
      return wipErr;
    }

    if (!lastLessonId) {
      return null;
    }

    const props = {
      ...this.props,
      language: contentLanguage,
      match: {
        ...this.props.match,
        params: {
          id: lastLessonId,
        }
      },
      shouldRenderHelmet: false,
    };

    return (
      <div>
        <Helmets.Basic title={t('lessons.last.title')} description={t('lessons.last.description')} />
        <Helmets.Image unitOrUrl={publicFile('seo/last_lesson.jpg')} />

        <PlaylistCollectionContainer {...props} />
      </div>
    );
  }
}

function mapState(state) {
  return {
    collection: selectors.getDenormCollectionWUnits(state.mdb, selectors.getLastLessonId(state.mdb)),
    lastLessonId: selectors.getLastLessonId(state.mdb),
    wip: selectors.getWip(state.mdb),
    errors: selectors.getErrors(state.mdb),
    uiLanguage: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
    cWindow: selectors.getWindow(state.mdb),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchLatestLesson: actions.fetchLatestLesson,
    fetchCollection: actions.fetchCollection,
    fetchUnit: actions.fetchUnit,
    fetchWindow: actions.fetchWindow,
  }, dispatch);
}

export default withRouter(connect(mapState, mapDispatch)(withNamespaces()(LastLessonCollection)));
