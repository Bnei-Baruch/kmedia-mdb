import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Filters from '../Filters/Filters';
import filterComponents from '../Filters/filterComponents';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter
  },
];

class LibraryFilters extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, onHydrated } = this.props;

    return (
      <div>
        <FiltersHydrator namespace="sources" onHydrated={onHydrated} />
        <Filters namespace="sources" filters={filters} onFilterApplication={onChange} />
        <FilterTags namespace="sources" onClose={onChange} />
      </div>
    );
  }
}

export default LibraryFilters;
