import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Divider, Grid } from 'semantic-ui-react';

import { CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions, selectors as eventSelectors } from '../../../redux/modules/events';
import * as shapes from '../../shapes';
import EventsList from './EventsList';
import EventsFilters from './EventsFilters';
import withPagination from '../../pagination/withPagination';

const allEventTypes = [CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY];

class EventsContainer extends withPagination {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.EventCollection, shapes.EventItem])),
    contentTypes: PropTypes.arrayOf(PropTypes.string),
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
  };

  static defaultProps = {
    items: [],
    contentTypes: allEventTypes
  };

  componentDidMount() {
    withPagination.askForData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      withPagination.askForData(nextProps);
    }

    super.componentWillReceiveProps(nextProps);
  }

  render() {
    const { items } = this.props;

    return (
      <div>
        <EventsFilters
          onChange={() => withPagination.handlePageChange(this.props, 1)}
          onHydrated={() => withPagination.handlePageChange(this.props)}
        />
        <Grid.Column width={16}>
          <withPagination.ResultsPageHeader {...this.props} />
          <Divider />
          <EventsList items={items} />
          <withPagination.Pagination {...this.props} />
        </Grid.Column>
      </div>
    );
  }
}

const mapState = (state) => {
  const parentProps = withPagination.mapState('events', state, eventSelectors, settings);
  return {
    ...parentProps,
    items: eventSelectors.getItems(state.events)
      .map(x => mdb.getDenormCollection(state.mdb, x[0])),
    language: settings.getLanguage(state.settings),
  };
};

export default connect(mapState, actions)(EventsContainer);
