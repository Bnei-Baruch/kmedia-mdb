import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/programs';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import FullProgram from './FullProgram';

class FullProgramContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fullProgram: shapes.ProgramCollection,
    wip: shapes.WipMap,
    errors: shapes.ErrorsMap,
    fetchFullProgram: PropTypes.func.isRequired,
    fetchProgramChapter: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullProgram: null,
    wip: { fulls: {}, chapters: {} },
    errors: { fulls: {}, chapters: {} },
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, fullProgram, wip, errors, fetchFullProgram, fetchProgramChapter } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const id = match.params.id;
    if (fullProgram && fullProgram.id === id && fullProgram.cuIDs) {
      fullProgram.cuIDs.forEach((cuID) => {
        const cu = fullProgram.content_units.find(x => x.id === cuID);
        if (!cu || !cu.files) {
          if (!(wip.chapters[cuID] || errors.chapters[cuID])) {
            fetchProgramChapter(cuID);
          }
        }
      });
    } else if (!(wip.fulls[id] || errors.fulls[id])) {
      fetchFullProgram(id);
    }
  };

  render() {
    const { match, language, fullProgram, wip: wipMap, errors } = this.props;

    // We're wip / err if some request is wip / err
    const id = match.params.id;
    let wip  = wipMap.fulls[id];
    let err  = errors.fulls[id];
    if (fullProgram && fullProgram.cuIDs) {
      wip = wip || fullProgram.cuIDs.some(cuID => wipMap.chapters[cuID]);
      if (!err) {
        const cuIDwithError = fullProgram.cuIDs.find(cuID => errors.chapters[cuID]);
        err                 = cuIDwithError ? errors.chapters[cuIDwithError] : null;
      }
    }

    return <FullProgram fullProgram={fullProgram} wip={wip} err={err} language={language} />;
  }
}

function mapState(state, props) {
  const fullProgram = mdb.getDenormCollection(state.mdb, props.match.params.id);

  return {
    fullProgram,
    wip: selectors.getWip(state.programs),
    errors: selectors.getErrors(state.programs),
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchFullProgram: actions.fetchFullProgram,
    fetchProgramChapter: actions.fetchProgramChapter,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FullProgramContainer);
