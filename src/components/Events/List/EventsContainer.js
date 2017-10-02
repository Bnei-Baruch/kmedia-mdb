import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filterSelectors } from '../../../redux/modules/filters';
import { actions, selectors as eventSelectors } from '../../../redux/modules/events';
import * as shapes from '../../shapes';
import Page from './Page';

class EventsContainer extends Component {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    fetchAllEvents: PropTypes.func.isRequired,
    filteredItems: PropTypes.arrayOf(shapes.EventCollection),
    hasItems: PropTypes.bool,
    wip: shapes.WIP,
    err: shapes.Error,
  };

  static defaultProps = {
    hasItems: false,
    filteredItems: [],
    wip: false,
    err: null,
  };

  componentDidMount() {
    const { hasItems, fetchAllEvents, wip, err } = this.props;

    // We only fetch one time on first mount, if not wip or error.
    // Next time we fetch is on language change.
    if (!hasItems && !(wip || err)) {
      fetchAllEvents();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      nextProps.fetchAllEvents();
    }
  }

  render() {
    const { filteredItems, wip, err } = this.props;
    return <Page items={filteredItems} wip={wip} err={err} />;
  }
}

const mapState = (state) => {
  const filters       = filterSelectors.getFilters(state.filters, 'events');
  const filteredItems = eventSelectors.getFilteredData(state.events, filters, state.mdb);

  return {
    filteredItems,
    hasItems: eventSelectors.getItems(state.events).length > 0,
    language: settings.getLanguage(state.settings),
    wip: eventSelectors.getWip(state.events).list,
    err: eventSelectors.getErrors(state.events).list,
  };
};

export default connect(mapState, actions)(EventsContainer);
