import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/filterComponents';
import FiltersHydrator from '../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter
  },
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
];

class FullProgramFilters extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, onHydrated } = this.props;

    return (
      <div>
        <FiltersHydrator namespace="full-program" onHydrated={onHydrated} />
        <Filters
          namespace="full-program"
          filters={filters}
          onFilterApplication={onChange}
        />
        <FilterTags namespace="full-program" onClose={onChange} />
      </div>
    );
  }
}

export default FullProgramFilters;
