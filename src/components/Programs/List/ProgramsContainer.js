import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import { actions, selectors as programSelectors } from '../../../redux/modules/programs';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions as filtersActions, selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import ProgramsFilters from './ProgramsFilters';
import ProgramsList from './ProgramsList';

class ProgramsContainer extends withPagination {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    fetchList: PropTypes.func.isRequired,
    editNewFilter: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(shapes.ProgramChapter),
    isFiltersHydrated: PropTypes.bool,
    shouldOpenProgramsFilter: PropTypes.bool,
  };

  static defaultProps = {
    items: [],
    isFiltersHydrated: false,
    shouldOpenProgramsFilter: true,
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (this.props.isFiltersHydrated) {
      withPagination.askForData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      withPagination.askForData(nextProps);
    }

    super.componentWillReceiveProps(nextProps);
  }

  handleFiltersHydrated = () => {
    withPagination.handlePageChange(this.props);

    if (this.props.shouldOpenProgramsFilter) {
      this.props.editNewFilter('programs', 'programs-filter');
    }
  };

  handleFiltersChanged = () =>
    withPagination.handlePageChange(this.props, 1);

  render() {
    const { items } = this.props;

    return (
      <div>
        <ProgramsFilters
          onChange={this.handleFiltersChanged}
          onHydrated={this.handleFiltersHydrated}
        />
        <Container className="padded">
          <withPagination.ResultsPageHeader {...this.props} />
          <ProgramsList items={items} />
        </Container>
        <Divider fitted />
        <Container className="padded" textAlign="center">
          <withPagination.Pagination {...this.props} />
        </Container>
      </div>
    );
  }
}

const mapState = (state) => {
  const paginationProps = withPagination.mapState('programs', state, programSelectors, settings);

  // we want to open programs-filter if no filter is applied
  const allFilters               = filters.getFilters(state.filters, 'programs');
  const shouldOpenProgramsFilter = allFilters.length === 0;

  return {
    ...paginationProps,
    items: programSelectors.getItems(state.programs)
      .map(x => mdb.getDenormContentUnit(state.mdb, x)),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'programs'),
    shouldOpenProgramsFilter,
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
    editNewFilter: filtersActions.editNewFilter,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(ProgramsContainer);
