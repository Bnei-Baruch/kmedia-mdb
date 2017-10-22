import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import Filters from '../Filters/Filters';
import filterComponents from '../Filters/filterComponents';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter
  }
];


class SearchResultsFilters extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { t, sortBy, onSortByChange, onHydrated, onChange } = this.props;

    const options = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    return (
      <div style={{display: 'flex'}}>
        <div style={{flex: '1', display: 'flex', flexDirection: 'column'}}>
          <FiltersHydrator namespace="search" onHydrated={onHydrated} />
          <Filters namespace="search" filters={filters} onFilterApplication={onChange} />
          <FilterTags namespace="search" onClose={onChange} />
        </div>
        <div style={{borderBottom: '2px solid rgba(34,36,38,.15)',
                     display: 'inline-table',
                     paddingBottom: '3px'}}>
          <span style={{padding: '10px'}}>
            {t('search.sortby')}:
          </span>
          <Dropdown
            compact
            selection
            options={options}
            value={sortBy}
            onChange={onSortByChange}
          />
        </div>
      </div>
    );
  }
}

export default translate()(SearchResultsFilters);
