import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import { EVENT_TYPES } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filterSelectors } from '../../../redux/modules/filters';
import { actions, selectors as eventSelectors } from '../../../redux/modules/events';
import * as shapes from '../../shapes';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import EventsList from './EventsList';
import EventsFilters from './EventsFilters';

class EventsContainer extends Component {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.EventCollection, shapes.EventItem])),
    contentTypes: PropTypes.arrayOf(PropTypes.string),
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: [],
    contentTypes: EVENT_TYPES
  };

  render() {
    const { items } = this.props;

    return (
      <div>
        <EventsFilters />
        <Container className="padded">
          <ResultsPageHeader {...this.props} />
          <Divider fitted />
          <EventsList items={items} />
        </Container>
      </div>
    );
  }
}

const mapState = (state) => {
  const filters                      = filterSelectors.getFilters(state.filters, 'events');
  const { items, ...paginationInfo } = eventSelectors.getFilteredData(state.events, filters, state.mdb);

  return {
    ...paginationInfo,
    items,
    language: settings.getLanguage(state.settings),
  };
};

export default connect(mapState, actions)(EventsContainer);
