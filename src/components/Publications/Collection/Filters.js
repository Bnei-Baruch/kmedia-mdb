import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/filterComponents';
import FiltersHydrator from '../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
];

class PublicationCollectionFilters extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, onHydrated } = this.props;

    return (
      <div>
        <FiltersHydrator namespace="publications-collection" onHydrated={onHydrated} />
        <Filters
          namespace="publications-collection"
          filters={filters}
          onFilterApplication={onChange}
        />
        <FilterTags namespace="publications-collection" onClose={onChange} />
      </div>
    );
  }
}

export default PublicationCollectionFilters;
