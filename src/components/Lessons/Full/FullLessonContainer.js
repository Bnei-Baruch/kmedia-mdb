import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import FullLesson from './FullLesson';

class FullLessonContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fetchFullLesson: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { language, match } = this.props;
    this.askForData(match.params.id, language);
  }

  componentWillReceiveProps(nextProps) {
    const { language, match } = nextProps;
    const props               = this.props;

    if (language !== props.language || match.params.id !== props.match.params.id) {
      this.askForData(language, match.params.id);
    }
  }

  askForData(id, language) {
    this.props.fetchFullLesson({ id, language });
  }

  render() {
    console.log(this.props);
    return <FullLesson {...this.props} />;
  }
}

function mapState(state, props) {
  return {
    fullLesson: mdb.getCollectionById(state.mdb)(props.match.params.id),
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapState, mapDispatch)(FullLessonContainer);
