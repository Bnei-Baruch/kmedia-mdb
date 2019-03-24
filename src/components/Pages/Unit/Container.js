import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import Page from './Page';

export class UnitContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired, // eslint-disable-line react/no-unused-prop-types
    unit: shapes.ContentUnit,
    wip: shapes.WIP,
    err: shapes.Error,
    section: PropTypes.string,
    language: PropTypes.string.isRequired,
    fetchUnit: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    unit: null,
    wip: false,
    err: null,
    section: '',
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

    const { id } = match.params;
    if (
      unit
      && unit.id === id
      && Array.isArray(unit.files)) {
      return;
    }

    fetchUnit(id);
  };

  render() {
    const { language, unit, wip, err, section } = this.props;
    return (
      <Page
        unit={wip || err ? null : unit}
        language={language}
        wip={wip}
        err={err}
        section={section}
      />
    );
  }
}

const mapState = (state, ownProps) => {
  const id = ownProps.match.params.id;
  return {
    unit: selectors.getDenormContentUnit(state.mdb, id),
    wip: selectors.getWip(state.mdb).units[id],
    err: selectors.getErrors(state.mdb).units[id],
    language: settings.getLanguage(state.settings),
  };
};

const mapDispatch = dispatch => bindActionCreators({
  fetchUnit: actions.fetchUnit,
}, dispatch);

export const wrap = WrappedComponent => withRouter(connect(mapState, mapDispatch)(WrappedComponent));

export default wrap(UnitContainer);
