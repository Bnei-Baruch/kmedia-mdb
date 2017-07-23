import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions } from '../../../redux/modules/lessons';
import * as shapes from '../../shapes';
import LessonPart from './LessonPart';

class LessonPartContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fetchLessonPart: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match } = this.props;
    this.askForData(match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const { match, language } = nextProps;
    if (match.params.id !== this.props.match.params.id) {
      this.askForData(match.params.id);
    }

    if (language !== this.props.language) {
      this.askForData(match.params.id);
    }
  }

  askForData(id) {
    this.props.fetchLessonPart(id);
  }

  render() {
    const { lesson, language } = this.props;
    return <LessonPart lesson={lesson} language={language} />;
  }
}

export default connect(
  (state, ownProps) => ({
    lesson: mdb.getDenormContentUnit(state.mdb, ownProps.match.params.id),
    language: settings.getLanguage(state.settings),
  }),
  actions
)(LessonPartContainer);
