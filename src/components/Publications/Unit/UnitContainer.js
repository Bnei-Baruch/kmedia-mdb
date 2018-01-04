import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/publications';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import Unit from './Unit';

class PublicationUnitContainer extends Component {

  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    unit: shapes.Article,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: null,
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
    const { match, unit, wip, err, fetchUnit } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    if (wip || err) {
      return;
    }

    const id = match.params.id;
    if (
      unit &&
      unit.id === id &&
      Array.isArray(unit.files)) {
      return;
    }

    fetchUnit(id);
  };

  render() {
    const { language, unit, wip, err } = this.props;
    return (
      <Unit
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
      />
    );
  }
}

export default connect(
  (state, ownProps) => {
    const id = ownProps.match.params.id;
    return {
      unit: mdb.getDenormContentUnit(state.mdb, id),
      wip: selectors.getWip(state.publications).units[id],
      err: selectors.getErrors(state.publications).units[id],
      language: settings.getLanguage(state.settings),
    };
  },
  dispatch => bindActionCreators({
    fetchUnit: actions.fetchUnit,
  }, dispatch)
)(PublicationUnitContainer);
