import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';

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