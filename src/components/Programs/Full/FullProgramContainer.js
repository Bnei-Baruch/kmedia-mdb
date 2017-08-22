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
    wip: PropTypes.bool,
    err: shapes.Error,
    fetchFullProgram: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullProgram: null,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.askForData(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.askForData(nextProps.match.params.id);
    }

    if (nextProps.language !== this.props.language) {
      this.askForData(nextProps.match.params.id);
    }
  }

  askForData = (id) => {
    this.props.fetchFullProgram(id);
  };

  render() {
    const { language, fullProgram, wip, err } = this.props;

    return <FullProgram fullProgram={fullProgram} wip={wip} err={err} language={language} />;
  }
}

function mapState(state, props) {
  const id          = props.match.params.id;
  const fullProgram = mdb.getDenormCollection(state.mdb, id);

  return {
    fullProgram,
    wip: selectors.getWip(state.programs).fulls[id],
    err: selectors.getErrors(state.programs).fulls[id],
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
