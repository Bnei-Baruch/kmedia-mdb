import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { actions, selectors } from '../../../redux/modules/lectures';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
// import { actions as filtersActions, selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import Lectures from './Lectures';

class LecturesContainer extends withPagination {

  static propTypes = {
      location: shapes.HistoryLocation.isRequired
    , items: PropTypes.arrayOf(shapes.Lecture)
    , wip: shapes.WIP
    , err: shapes.Error
    // , pageNo: PropTypes.number.isRequired
    // , total: PropTypes.number.isRequired
    // , pageSize: PropTypes.number.isRequired
    , language: PropTypes.string.isRequired
    // , isFiltersHydrated: PropTypes.bool
    // , shouldOpenProgramsFilter: PropTypes.bool
    , fetchList: PropTypes.func.isRequired
    // , setPage: PropTypes.func.isRequired
    // , editNewFilter: PropTypes.func.isRequired
  };

  static defaultProps = {
      items: []
    // , isFiltersHydrated: false
    // , shouldOpenProgramsFilter: true
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    // if (this.props.isFiltersHydrated) {
      withPagination.askForData(this.props);
    // }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      withPagination.askForData(nextProps);
    }

    super.componentWillReceiveProps(nextProps);
  }

  handlePageChanged = pageNo =>
    withPagination.handlePageChange(this.props, pageNo);

  handleFiltersChanged = () =>
    withPagination.handlePageChange(this.props, 1);

  handleFiltersHydrated = () => {
    withPagination.handlePageChange(this.props);

    // if (this.props.shouldOpenProgramsFilter) {
    //   this.props.editNewFilter('programs', 'programs-filter');
    // }
  };

  render() {

    // return null;
    const { items, wip, err, pageNo, total, pageSize, language } = this.props;

    return (
      <Lectures
        items={items}
        wip={wip}
        err={err}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        language={language}
        onPageChange={this.handlePageChanged}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={this.handleFiltersHydrated}
      />
    );
  }
}

const mapState = (state) => {
  const paging = withPagination.mapState('lectures', state, selectors, settings);

  // we want to open programs-filter if no filter is applied
  // const allFilters               = filters.getFilters(state.filters, 'programs');
  // const shouldOpenProgramsFilter = allFilters.length === 0;

  return {
    items: selectors.getItems(state.lectures)
      .map(x => mdb.getDenormContentUnit(state.mdb, x))
    , wip: selectors.getWip(state.lectures).list
    , err: selectors.getErrors(state.lectures).list
    , pageNo: paging.pageNo
    , total: paging.total
    , pageSize: settings.getPageSize(state.settings)
    , language: settings.getLanguage(state.settings)
    // , isFiltersHydrated: filters.getIsHydrated(state.filters, 'programs')
    // , shouldOpenProgramsFilter
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
      fetchList: actions.fetchList
    , setPage: actions.setPage
    // , editNewFilter: filtersActions.editNewFilter
  }, dispatch);
}

export default connect(mapState, mapDispatch)(LecturesContainer);
// export default translate()(LecturesContainer);
