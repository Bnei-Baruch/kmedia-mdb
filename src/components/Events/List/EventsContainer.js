import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import { EVENT_TYPES } from '../../../helpers/consts';
import { formatError } from '../../../helpers/utils';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as filterSelectors } from '../../../redux/modules/filters';
import { actions, selectors as eventSelectors } from '../../../redux/modules/events';
import * as shapes from '../../shapes';
import { ErrorSplash, LoadingSplash } from '../../shared/Splash';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import EventsList from './EventsList';
import EventsFilters from './EventsFilters';

class EventsContainer extends Component {

  static propTypes = {
    fetchAllEvents: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.EventCollection, shapes.EventItem])),
    contentTypes: PropTypes.arrayOf(PropTypes.string),
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    contentTypes: EVENT_TYPES,
    wip: false,
    err: null,
  };

  componentDidMount() {
    this.props.fetchAllEvents();
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      nextProps.fetchAllEvents();
    }
  }

  render() {
    const { items, wip, err, t } = this.props;

    if (err) {
      return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    }

    if (Array.isArray(items) && items.length > 0) {
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

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    return null;
  }
}

const mapState = (state) => {
  const filters                      = filterSelectors.getFilters(state.filters, 'events');
  const { items, ...paginationInfo } = eventSelectors.getFilteredData(state.events, filters, state.mdb);

  return {
    ...paginationInfo,
    items,
    language: settings.getLanguage(state.settings),
    wip: eventSelectors.getWip(state.events).list,
    err: eventSelectors.getErrors(state.events).list,
  };
};

export default connect(mapState, actions)(translate()(EventsContainer));
