import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../../redux/modules/mdb';
import { selectors as settings } from '../../../../redux/modules/settings';
import * as shapes from '../../../shapes';
import Helmets from '../../../shared/Helmets';
import WipErr from '../../../shared/WipErr/WipErr';
import { PlaylistCollectionContainer } from '../../../Pages/PlaylistCollection/Container';
import { equal, publicFile } from '../../../../helpers/utils';

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

  constructor(props) {
    super(props);
    this.state = {
      language: this.props.contentLanguage,
    };
  }

  componentDidMount() {
    if (!this.props.lastLessonId) {
      this.props.fetchLatestLesson();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.language !== nextProps.contentLanguage) {
      this.setState({ language: nextProps.contentLanguage });
      nextProps.fetchLatestLesson();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { uiLanguage, contentLanguage, wip, err, } = nextProps;
    const { language }                               = nextState;
    const { props, state }                           = this;

    return !(
      uiLanguage === props.uiLanguage &&
      language === state.filesLanguage &&
      contentLanguage === state.filesLanguage &&
      equal(wip, props.wip) && equal(err, props.err)
    );
  }

  render() {
    const { wip, errors, t, lastLessonId } = this.props;
    const { language }                     = this.state;

    const wipErr = WipErr({ wip: wip.lastLesson, err: errors.lastLesson, t });
    if (wipErr) {
      return wipErr;
    }

    if (!lastLessonId) {
      return null;
    }

    const props = {
      ...this.props,
      language,
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
  const lastLessonId = selectors.getLastLessonId(state.mdb);
  const collection   = selectors.getDenormCollectionWUnits(state.mdb, lastLessonId);
  return {
    collection,
    lastLessonId,
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
