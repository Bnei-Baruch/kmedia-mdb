import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/filterComponents';
import FiltersHydrator from '../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../Filters/FilterTags/FilterTags';
import ResultsPageHeader from '../../shared/ResultsPageHeader';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter
  },
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter
  }
];

class LessonsFilters extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, onHydrated } = this.props;

    return (
      <div>
        <FiltersHydrator namespace="lessons" onHydrated={onHydrated} />
        <Filters namespace="lessons" filters={filters} onFilterApplication={onChange} />
        <ResultsPageHeader {...this.props} />
        <FilterTags namespace="lessons" onClose={onChange} />
      </div>
    );
  }
}

export default LessonsFilters;
