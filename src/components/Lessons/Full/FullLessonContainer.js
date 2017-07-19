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
import FullLesson from './FullLesson';

class FullLessonContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fetchFullLesson: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.fetchFullLessonIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchFullLessonIfNeeded(nextProps);
  }

  fetchFullLessonIfNeeded = (props) => {
    const { fullLesson } = props;
    const collectionId = props.match.params.id;
    if (!fullLesson && collectionId !== null || props.language !== this.props.language) {
      props.fetchFullLesson(collectionId);
    }
  };

  render() {
    return <FullLesson {...this.props} />;
  }
}

function mapState(state, props) {
  return {
    fullLesson: mdb.getCollectionById(state.mdb)(props.match.params.id),
    getUnitById: mdb.getUnitById(state.mdb),
    language: settings.getLanguage(state.settings),

    // NOTE (yaniv -> ido): using selectors this way will always make the component rerender
    // since sources.getSourcesById(state) !== sources.getSourcesById(state) for every state
    getSourceById: sources.getSourceById(state.sources),
    getTagById: tags.getTagById(state.tags),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(FullLessonContainer);
