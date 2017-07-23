import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'moment-duration-format';

import { CT_DAILY_LESSON, CT_SPECIAL_LESSON } from '../../../../helpers/consts';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../redux/modules/lessons';
import * as shapes from '../../../shapes';
import RelevantParts from './RelevantParts';

const getCollectionIdFromLesson = lesson => {
  if (lesson.collections) {
    const collections        = Object.values(lesson.collections);
    const relevantCollection = collections.find(collection =>
      collection.content_type === CT_DAILY_LESSON ||
      collection.content_type === CT_SPECIAL_LESSON
    );

    if (relevantCollection) {
      return relevantCollection.id;
    }
  }

  return null;
};

class RelevantPartsContainer extends Component {

  static propTypes = {
    lesson: shapes.LessonPart.isRequired,
    fullLessonID: PropTypes.string,
    fullLesson: shapes.LessonCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchFullLesson: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullLesson: null,
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
    const { fullLesson, fullLessonID, wip, err, fetchFullLesson } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    if (
      fullLesson &&
      fullLesson.id === fullLessonID &&
      Array.isArray(fullLesson.content_units)) {
      return;
    }

    if (fullLessonID && !(wip || err)) {
      fetchFullLesson(fullLessonID);
    }
  };

  render() {
    const { lesson, fullLesson, wip, err } = this.props;

    return <RelevantParts
      lesson={lesson}
      err={err}
      wip={wip}
      fullLesson={wip || err ? null : fullLesson}
    />;
  }
}

export default connect(
  (state, ownProps) => {
    const fullLessonID = getCollectionIdFromLesson(ownProps.lesson);
    return {
      fullLessonID,
      fullLesson: fullLessonID ? mdb.getDenormCollection(state.mdb, fullLessonID) : null,
      wip: selectors.getWip(state.lessons).fulls[fullLessonID],
      errors: selectors.getErrors(state.lessons).fulls[fullLessonID],
    };
  },
  actions
)(RelevantPartsContainer);
