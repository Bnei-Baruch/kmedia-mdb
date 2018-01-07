import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/filterComponents';
import FiltersHydrator from '../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'programs-filter',
    component: filterComponents.ProgramsFilter
  },
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter
  },
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter
  },
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
];

class ProgramsFilters extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, onHydrated } = this.props;

    return (
      <div>
        <FiltersHydrator namespace="programs" onHydrated={onHydrated} />
        <Filters
          namespace="programs"
          filters={filters}
          onFilterApplication={onChange}
        />
        <FilterTags namespace="programs" onClose={onChange} />
      </div>
    );
  }
}

export default ProgramsFilters;
