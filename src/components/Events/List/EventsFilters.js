import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/filterComponents';
import FiltersHydrator from '../../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'event-types-filter',
    component: filterComponents.EventTypesFilter
  },
  {
    name: 'years-filter',
    component: filterComponents.YearsFilter
  }
];

class EventsFilter extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
  };

  render() {
    const { onChange, onHydrated } = this.props;

    return (
      <div>
        <FiltersHydrator namespace="events" onHydrated={onHydrated} />
        <Filters namespace="events" filters={filters} onFilterApplication={onChange} />
        <FilterTags namespace="events" onClose={onChange} />
      </div>
    );
  }
}

export default EventsFilter;
