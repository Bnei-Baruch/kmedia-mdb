import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/lessons';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import FullLesson from './FullLesson';

class FullLessonContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
    wip: shapes.WipMap,
    errors: shapes.ErrorsMap,
    fetchFullLesson: PropTypes.func.isRequired,
    fetchLessonPart: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullLesson: null,
    wip: { fulls: {}, parts: {} },
    errors: { fulls: {}, parts: {} },
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, fullLesson, wip, errors, fetchFullLesson, fetchLessonPart } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const id = match.params.id;
    if (fullLesson && fullLesson.id === id) {
      fullLesson.cuIDs.forEach((cuID) => {
        const cu = fullLesson.content_units.find(x => x.id === cuID);
        if (!cu || !cu.files) {
          if (!(wip.parts[cuID] || errors.parts[cuID])) {
            fetchLessonPart(cuID);
          }
        }
      });
    } else if (!(wip.fulls[id] || errors.fulls[id])) {
      fetchFullLesson(id);
    }
  };

  render() {
    const { match, language, fullLesson, wip: wipMap, errors } = this.props;

    // We're wip / err if some request is wip / err
    const id = match.params.id;
    let wip  = wipMap.fulls[id];
    let err  = errors.fulls[id];
    if (fullLesson) {
      wip = wip || fullLesson.cuIDs.some(cuID => wipMap.parts[cuID]);
      if (!err) {
        const cuIDwithError = fullLesson.cuIDs.find(cuID => errors.parts[cuID]);
        err                 = cuIDwithError ? errors.parts[cuIDwithError] : null;
      }
    }

    return <FullLesson fullLesson={fullLesson} wip={wip} err={err} language={language} />;
  }
}

function mapState(state, props) {
  const fullLesson = mdb.getDenormCollection(state.mdb, props.match.params.id);

  return {
    fullLesson,
    wip: selectors.getWip(state.lessons),
    errors: selectors.getErrors(state.lessons),
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchFullLesson: actions.fetchFullLesson,
    fetchLessonPart: actions.fetchLessonPart,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FullLessonContainer);
