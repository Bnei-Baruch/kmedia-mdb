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
    wip: PropTypes.bool,
    err: shapes.Error,
    fetchFullEvent: PropTypes.func.isRequired,
    fetchEventItem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullEvent: null,
    wip: false,
    errors: null,
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
    this.props.fetchFullEvent(id);
  };

  render() {
    const { language, fullEvent, wip, err } = this.props;

    return <FullEvent fullEvent={fullEvent} wip={wip} err={err} language={language} />;
  }
}

function mapState(state, props) {
  const id        = props.match.params.id;
  const fullEvent = mdb.getDenormCollection(state.mdb, id);

  return {
    fullEvent,
    wip: selectors.getWip(state.programs).fulls[id],
    err: selectors.getErrors(state.programs).fulls[id],
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
