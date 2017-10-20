import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/events';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import * as shapes from '../../shapes';
import EventItem from './EventItem';

class EventItemContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    item: shapes.EventItem,
    wip: shapes.WIP,
    err: shapes.Error,
    fetchEventItem: PropTypes.func.isRequired,
  };

  static defaultProps = {
    item: null,
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
    const { match, item, wip, err, fetchEventItem } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    if (wip || err) {
      return;
    }

    const id = match.params.id;
    if (
      item &&
      item.id === id &&
      Array.isArray(item.files)) {
      return;
    }

    fetchEventItem(id);
  };

  render() {
    const { language, item, wip, err } = this.props;
    return (
      <EventItem
        item={wip || err ? null : item}
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
      item: mdb.getDenormContentUnit(state.mdb, id),
      wip: selectors.getWip(state.events).items[id],
      err: selectors.getErrors(state.events).items[id],
      language: settings.getLanguage(state.settings),
    };
  },
  dispatch => bindActionCreators({
    fetchEventItem: actions.fetchEventItem,
  }, dispatch)
)(EventItemContainer);
