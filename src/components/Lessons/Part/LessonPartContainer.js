import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tags } from '../../../redux/modules/tags';
import { actions } from '../../../redux/modules/lessons';
import * as shapes from '../../shapes';
import LessonPart from './LessonPart';

class LessonPartContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    fetchLessonPart: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match } = this.props;
    this.askForData(match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const { match } = nextProps;
    if (match.params.id !== this.props.match.params.id) {
      this.askForData(match.params.id);
    }
  }

  askForData(id) {
    this.props.fetchLessonPart(id);
  }

  render() {
    return <LessonPart {...this.props} />;
  }
}

export default connect(
  (state, ownProps) => ({
    lesson: mdb.getUnitById(state.mdb)(ownProps.match.params.id),
    getSourceById: sources.getSourceById(state.sources),
    getTagById: tags.getTagById(state.tags),
  }),
  actions
)(LessonPartContainer);
