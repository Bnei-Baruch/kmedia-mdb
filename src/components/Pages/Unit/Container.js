import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import UnitPage, { wrap as wrapPage } from './Page';
import WipErr from '../../shared/WipErr/WipErr';

export class UnitContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    unit: shapes.ContentUnit,
    wip: shapes.WIP,
    err: shapes.Error,
    section: PropTypes.string,
    language: PropTypes.string.isRequired,
    fetchUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: null,
    wip: false,
    err: null,
    section: '',
  };

  static askForDataIfNeeded = (props, forceUpdate) => {
    const { match, unit, wip, err, fetchUnit } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    if (wip || err) {
      return;
    }

    const { id } = match.params;
    if (
      !forceUpdate
      && unit
      && unit.id === id
      && Array.isArray(unit.files)) {
      return;
    }

    fetchUnit(id);
  };

  componentDidMount() {
    UnitContainer.askForDataIfNeeded(this.props, true);
  }

  componentDidUpdate() {
    UnitContainer.askForDataIfNeeded(this.props, false);
  }

  render() {
    const { language, unit, wip, err, section, t } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    return (
      <UnitPage
        unit={wip || err ? null : unit}
        language={language}
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

export default wrap(wrapPage(UnitContainer));
