import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/events';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import FullEvent from './FullEvent';

class FullEventContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    fullEvent: shapes.EventCollection,
    wip: shapes.WipMap,
    errors: shapes.ErrorsMap,
    fetchFullEvent: PropTypes.func.isRequired,
    fetchEventItem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullEvent: null,
    // Fix: chapters to units and parts to units everywhere!!!
    wip: { fulls: {}, items: {} },
    errors: { fulls: {}, items: {} },
  };

  // TODO: Following 3 methods are copy/paste from full lesson. Consider reuse by some HOC.
  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, fullEvent, wip, errors, fetchFullEvent, fetchEventItem } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const id = match.params.id;
    if (fullEvent && fullEvent.id === id && Array.isArray(fullEvent.cuIDs)) {
      fullEvent.cuIDs.forEach((cuID) => {
        const cu = fullEvent.content_units.find(x => x.id === cuID);
        if (!cu || !cu.files) {
          if (!(wip.items[cuID] || errors.items[cuID])) {
            fetchEventItem(cuID);
          }
        }
      });
    } else if (!(wip.fulls[id] || errors.fulls[id])) {
      fetchFullEvent(id);
    }
  };

  render() {
    const { match, language, fullEvent, wip: wipMap, errors } = this.props;

    // We're wip / err if some request is wip / err
    const id = match.params.id;
    let wip  = wipMap.fulls[id];
    let err  = errors.fulls[id];
    if (fullEvent) {
      wip = wip || (Array.isArray(fullEvent.cuIDs) && fullEvent.cuIDs.some(cuID => wipMap.items[cuID]));
      if (!err) {
        const cuIDwithError = Array.isArray(fullEvent.cuIDs) && fullEvent.cuIDs.find(cuID => errors.items[cuID]);
        err                 = cuIDwithError ? errors.items[cuIDwithError] : null;
      }
    }

    return <FullEvent fullEvent={fullEvent} wip={wip} err={err} language={language} />;
  }
}

function mapState(state, props) {
  const fullEvent = mdb.getDenormCollectionWUnits(state.mdb, props.match.params.id);

  return {
    fullEvent,
    wip: selectors.getWip(state.events),
    errors: selectors.getErrors(state.events),
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchFullEvent: actions.fetchFullEvent,
    fetchEventItem: actions.fetchEventItem,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FullEventContainer);
