import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import Filters from '../Filters/Filters';
import filterComponents from '../Filters/components';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter,
  },
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter,
  },
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter,
  },
  {
    name: 'sections-filter',
    component: filterComponents.SectionsFilter,
  },
  {
    name: 'language-filter',
    component: filterComponents.LanguageFilter,
  },
];

class SearchResultsFilters extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    filtersValues: PropTypes.objectOf(PropTypes.object).isRequired,
  };

  render() {
    const { t, filtersValues, sortBy, onSortByChange, onHydrated, onChange } = this.props;

    const options = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    const sortingDisabled =
            (filtersValues.values || []).some(f =>
              f.name === 'sections-filter' &&
              f.values &&
              f.values.includes('filters.sections-filter.sources'));

    return (
      <Filters
        namespace="search"
        filters={filters}
        onChange={onChange}
        onHydrated={onHydrated}
        rightItems={[
          <span key="span" style={{ padding: '10px' }}>
            {t('search.sortby')}:&nbsp;&nbsp;
            <Dropdown
              inline
              disabled={sortingDisabled}
              key="dropdown"
              options={options}
              value={sortBy}
              onChange={onSortByChange}
            />
          </span>,
        ]}
      />
    );
  }
}

export default connect(state => ({
  filtersValues: filterSelectors.getNSFilters(state.filters, 'search') || {},
}))(translate()(SearchResultsFilters));
