import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Divider } from 'semantic-ui-react';

import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../helpers/consts';
import { actions, selectors as programSelectors } from '../../../redux/modules/programs';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import ProgramsFilters from './ProgramsFilters';
import ProgramsList from './ProgramsList';
import withPagination from '../../pagination/withPagination';

class ProgramsContainer extends withPagination {

  static propTypes = {
    pageSize: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.ProgramCollection, shapes.ProgramChapter])),
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    location: shapes.HistoryLocation.isRequired,
  };

  static defaultProps = {
    items: [],
    isFiltersHydrated: false,
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

  render() {
    const { items } = this.props;

    return (
      <div>
        <ProgramsFilters
          onChange={() => withPagination.handlePageChange(this.props, 1)}
          onHydrated={() => withPagination.handlePageChange(this.props)}
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
  const parentProps = withPagination.mapState('programs', state, programSelectors, settings);
  return {
    ...parentProps,
    items: programSelectors.getItems(state.programs)
      .map(x => mdb.getDenormContentUnit(state.mdb, x)),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'programs'),
  };
};

export default connect(mapState, actions)(ProgramsContainer);
