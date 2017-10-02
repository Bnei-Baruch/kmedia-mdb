import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'moment-duration-format';

import { CT_VIDEO_PROGRAM } from '../../../../helpers/consts';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { actions, selectors } from '../../../../redux/modules/programs';
import * as shapes from '../../../shapes';
import RelevantParts from './RelevantParts';

const getCollectionIdFromProgram = (program) => {
  if (program.collections) {
    const collections        = Object.values(program.collections);
    const relevantCollection = collections.find(collection =>
      collection.content_type === CT_VIDEO_PROGRAM
    );

    if (relevantCollection) {
      return relevantCollection.id;
    }
  }

  return null;
};

class RelevantPartsContainer extends Component {

  static propTypes = {
    program: shapes.ProgramChapter.isRequired,
    fullProgramID: PropTypes.string,
    fullProgram: shapes.ProgramCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchFullProgram: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullProgram: null,
    fullProgramID: '',
    wip: false,
    err: null,
  };

  state = {
    fullProgramRequested: false,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { fullProgramID, wip, err, fetchFullProgram } = props;

    // TODO:
    // Maybe in the future we'll do something more sophisticated
    // to fetch data only in the case we really need it
    // The following code is wrong.
    //
    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    // if (
    //   fullProgram &&
    //   fullProgram.id === fullProgramID &&
    //   Array.isArray(fullProgram.content_units)) {
    //   return;
    // }

    if (this.state.fullProgramRequested) {
      return;
    }

    if (fullProgramID && !(wip || err)) {
      fetchFullProgram(fullProgramID);
      this.setState({ fullProgramRequested: true });
    }
  };

  render() {
    const { program, fullProgram, wip, err, t } = this.props;

    return (
      <RelevantParts
        program={program}
        wip={wip}
        err={err}
        fullProgram={(wip || err) ? null : fullProgram}
        t={t}
      />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const fullProgramID = getCollectionIdFromProgram(ownProps.program);
    return {
      fullProgramID,
      fullProgram: fullProgramID ? mdb.getDenormCollection(state.mdb, fullProgramID) : null,
      wip: selectors.getWip(state.programs).fulls[fullProgramID],
      errors: selectors.getErrors(state.programs).fulls[fullProgramID],
    };
  },
  dispatch => bindActionCreators({
    fetchFullProgram: actions.fetchFullProgram,
  }, dispatch)
)(RelevantPartsContainer);
