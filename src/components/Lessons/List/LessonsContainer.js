import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  };

  static defaultProps = {
    pageNo: 1,
    total: 0,
    items: [],
    isFiltersHydrated: false,
  };

  componentDidMount() {
    const { isFiltersHydrated } = this.props;

    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (isFiltersHydrated) {
      const { location, language, pageSize } = this.props;
      const pageNo                           = this.getPageNo(location.search);
      this.askForData(pageNo, language, pageSize);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { pageNo, language, pageSize } = nextProps;

    if (pageSize !== this.props.pageSize) {
      this.handlePageChange(1);
    }

    if (language !== this.props.language) {
      this.askForData(pageNo, language, pageSize);
    }
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      const match = search.match(/page=(\d+)/);
      if (match) {
        page = parseInt(match[1], 10);
      }
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  };

  handlePageChange = (pageNo) => {
    const { setPage, language, pageSize } = this.props;
    setPage(pageNo);
    this.askForData(pageNo, language, pageSize);
  };

  handleFiltersHydrated = () => {
    const { location } = this.props;
    const pageNo       = this.getPageNo(location.search);
    this.handlePageChange(pageNo);
  };

  askForData = (pageNo, language, pageSize) => {
    this.props.fetchList(pageNo, language, pageSize);
  };

  render() {
    const { pageNo, total, items, pageSize, language } = this.props;

    return (
      <Grid.Column width={16}>
        <LessonsFilters
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onChange={() => this.handlePageChange(1)}
          onHydrated={this.handleFiltersHydrated}
        />
        <Divider />
        <LessonsList items={items} />
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          language={language}
          onChange={this.handlePageChange}
        />
      </Grid.Column>
    );
  }
}

export default connect(
  state => ({
    pageNo: selectors.getPageNo(state.lessons),
    total: selectors.getTotal(state.lessons),
    items: selectors.getItems(state.lessons)
      .map(x => (x[1] === CT_LESSON_PART ?
        mdb.getUnitById(state.mdb, x[0]) :
        mdb.getDenormCollection(state.mdb, x[0]))),
    language: settings.getLanguage(state.settings),
    pageSize: settings.getPageSize(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'lessons'),
  }),
  actions
)(LessonsContainer);
