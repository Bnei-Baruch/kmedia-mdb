import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Divider, Grid } from 'semantic-ui-react';

import { CT_LESSON_PART } from '../../../helpers/consts';
import { actions, selectors } from '../../../redux/modules/lessons';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import Pagination from '../../shared/Pagination';
import LessonsFilters from './LessonsFilters';
import LessonsList from './LessonsList';
import withPagination from '../../../helpers/paginationHOC';

class LessonsContainer extends Component {

  static propTypes = {
    pageNo: PropTypes.number,
    total: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    pageSize: PropTypes.number.isRequired,
    isFiltersHydrated: PropTypes.bool,
    getPageNo: PropTypes.func.isRequired,
    askForData: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    resultsPageHeader: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    items: [],
    isFiltersHydrated: false,
  };

  componentDidMount() {
    const { isFiltersHydrated, askForData, getPageNo } = this.props;

    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (isFiltersHydrated) {
      const { location } = this.props;

      const pageNo = getPageNo(location.search);
      askForData({ ...this.props, pageNo });
    }
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

  handleFiltersHydrated = () => {
    const { location, handlePageChange, getPageNo } = this.props;

    const pageNo = getPageNo(location.search);
    handlePageChange(pageNo, this.props);
  };

  render() {
    const { pageNo, total, items, pageSize, language, handlePageChange, resultsPageHeader } = this.props;

    return (
      <Grid.Column width={16}>
        <LessonsFilters
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={() => handlePageChange(1, this.props)}
          onHydrated={this.handleFiltersHydrated}
        />
        {resultsPageHeader(this.props)}
        <Divider />
        <LessonsList items={items} />
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          language={language}
          onChange={x => handlePageChange(x, this.props)}
        />
      </Grid.Column>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      pageNo: selectors.getPageNo(state.lessons),
      total: selectors.getTotal(state.lessons),
      items: selectors.getItems(state.lessons)
        .map(x => (x[1] === CT_LESSON_PART ?
          mdb.getDenormContentUnit(state.mdb, x[0]) :
          mdb.getDenormCollectionWUnits(state.mdb, x[0]))),
      language: settings.getLanguage(state.settings),
      pageSize: settings.getPageSize(state.settings),
      isFiltersHydrated: filters.getIsHydrated(state.filters, 'lessons'),
    }),
    actions
  ),
  withPagination
);

export default enhance(LessonsContainer);
