import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { filterPropShape } from '../shapes';
import ActiveFilter from './ActiveFilter/ActiveFilter';
import FilterMenu from './FilterMenu/FilterMenu';

class Filter extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    onFilterApplication: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(filterPropShape).isRequired
  };

  state = {
    activeFilter: null,
  };

  handleFilterClick = ({ name }) => this.setState({ activeFilter: name });

  handleCancelActiveFilter = () => {
    this.setState({ activeFilter: null });
  }

  handleApplyActiveFilter = () => {
    this.props.onFilterApplication();
  };

  render() {
    const activeFilter = this.state.activeFilter;

    return (
      <div>
        <FilterMenu items={this.props.filters} active={activeFilter} onChoose={this.handleFilterClick} />
        <ActiveFilter
          namespace={this.props.namespace}
          activeFilterName={activeFilter}
          filters={this.props.filters}
          onCancel={() => this.handleCancelActiveFilter()}
          onApply={() => this.handleApplyActiveFilter()}
        />
      </div>
    );
  }
}

export default Filter;
