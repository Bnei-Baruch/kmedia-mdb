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
    const { t, selectedFilters, sortBy, onSortByChange, onHydrated, onChange } = this.props;

    const options = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    const rightItemsDisabled =
     selectedFilters.some(i => i.name == "sections-filter" && i.values && i.values.indexOf("filters.sections-filter.sources") > -1);
    
    return (
      <Filters
        namespace="search"
        filters={filters}
        onChange={onChange}
        onHydrated={onHydrated}
        rightItems={[
          <span key="span" style={{ padding: '10px' }}>
              {t('search.sortby')}:
            </span>,
          <Dropdown
            disabled={rightItemsDisabled}
            key="dropdown"
            item
            compact
            options={options}
            value={sortBy}
            onChange={onSortByChange}
          />
        ]}
      />
    );
  }
}

export default connect(state => ({
  selectedFilters: filterSelectors.getFilters(state.filters, 'search'),
}))(translate()(SearchResultsFilters));