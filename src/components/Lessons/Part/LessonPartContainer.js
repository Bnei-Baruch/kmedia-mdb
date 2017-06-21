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
    language: PropTypes.string.isRequired,
    fetchLessonPart: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { language, match } = this.props;
    this.askForData(match.params.id, language);
  }

  componentWillReceiveProps(nextProps) {
    const { language, match } = nextProps;
    const props               = this.props;

    if (language !== props.language || match.params.id !== props.match.params.id) {
      this.askForData(match.params.id, language);
    }
  }

  askForData(id, language) {
    this.props.fetchLessonPart({ id, language });
  }

  render() {
    return <LessonPart {...this.props} />;
  }
}

function mapState(state, props) {
  return {
    lesson: mdb.getUnitById(state.mdb)(props.match.params.id),
    language: settings.getLanguage(state.settings),
    getSourceById: sources.getSourceById(state.sources),
    getTagById: tags.getTagById(state.tags),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(LessonPartContainer);
