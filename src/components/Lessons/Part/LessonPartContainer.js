import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/lessons';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import LessonPart from './LessonPart';

class LessonPartContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    lesson: shapes.LessonPart,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchLessonPart: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lesson: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, lesson, wip, err, fetchLessonPart } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const id = match.params.id;
    if (
      lesson &&
      lesson.id === id &&
      Array.isArray(lesson.files)) {
      return;
    }

    if (!(wip || err)) {
      fetchLessonPart(id);
    }
  };

  render() {
    const { language, lesson, wip, err } = this.props;
    return (
      <LessonPart
        lesson={wip || err ? null : lesson}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const id = ownProps.match.params.id;
    return {
      lesson: mdb.getDenormContentUnit(state.mdb, id),
      wip: selectors.getWip(state.lessons).parts[id],
      err: selectors.getErrors(state.lessons).parts[id],
      language: settings.getLanguage(state.settings),
    };
  },
  dispatch => bindActionCreators({
    fetchLessonPart: actions.fetchLessonPart,
  }, dispatch)
)(LessonPartContainer);
