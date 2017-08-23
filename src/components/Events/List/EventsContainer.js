import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Divider, Grid } from 'semantic-ui-react';

import { CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions, selectors as eventSelectors } from '../../../redux/modules/events';
import * as shapes from '../../shapes';
import withPagination from '../../../helpers/pagination/paginationHOC';
import EventsList from './EventsList';

const allEventTypes = [CT_CONGRESS, CT_HOLIDAY, CT_PICNIC, CT_UNITY_DAY];

class EventsContainer extends Component {

  static propTypes = {
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.EventCollection, shapes.EventItem])),
    contentTypes: PropTypes.arrayOf(PropTypes.string),
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    getPageNo: PropTypes.func.isRequired,
    askForData: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    ResultsPageHeader: PropTypes.func.isRequired,
    Pagination: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    contentTypes: allEventTypes
  };

  componentDidMount() {
    const { location, askForData, getPageNo } = this.props;

    const pageNo = getPageNo(location.search);
    askForData({ ...this.props, pageNo });
  }

  componentWillReceiveProps(nextProps) {
    const { language, pageSize }           = nextProps;
    const { handlePageChange, askForData } = this.props;

    if (pageSize !== this.props.pageSize) {
      handlePageChange(1, nextProps);
    }

    if (language !== this.props.language) {
      askForData(nextProps);
    }
  }

  render() {
    const { items, handlePageChange, ResultsPageHeader, Pagination } = this.props;

    return (
      <Grid.Column width={16}>
        <ResultsPageHeader {...this.props} />
        <Divider />
        <EventsList items={items} />
        <Pagination {...this.props} onChange={x => handlePageChange(x, this.props)} />
      </Grid.Column>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      pageNo: eventSelectors.getPageNo(state.events),
      total: eventSelectors.getTotal(state.events),
      items: eventSelectors.getItems(state.events)
        .map(x => mdb.getDenormCollection(state.mdb, x[0])),
      language: settings.getLanguage(state.settings),
      pageSize: settings.getPageSize(state.settings),
    }),
    actions
  ),
  withPagination
);

export default enhance(EventsContainer);
