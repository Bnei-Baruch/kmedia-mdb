import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterPropShape } from '../shapes';
import { selectors as filterSelectors, actions as filterActions } from '../../redux/modules/filters';
import ActiveFilter from './ActiveFilter/ActiveFilter';
import FilterMenu from './FilterMenu/FilterMenu';

class Filters extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    onFilterApplication: PropTypes.func.isRequired,
    editNewFilter: PropTypes.func.isRequired,
    closeActiveFilter: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(filterPropShape).isRequired,
    activeFilter: PropTypes.string
  };

  static defaultProps = {
    activeFilter: ''
  };

  handleFilterClick = ({ name }) => {
    const { namespace } = this.props;
    this.props.editNewFilter(namespace, name);
  };

  handleCancelActiveFilter = () => {
    const { namespace, activeFilter } = this.props;
    this.props.closeActiveFilter(namespace, activeFilter);
  };

  handleApplyActiveFilter = () => {
    this.props.onFilterApplication();
  };

  render() {
    const { filters, activeFilter, namespace } = this.props;

    return (
      <div>
        <FilterMenu items={filters} namespace={namespace} active={activeFilter} onChoose={this.handleFilterClick} />
        <ActiveFilter
          namespace={namespace}
          activeFilterName={activeFilter}
          filters={this.props.filters}
          onCancel={this.handleCancelActiveFilter}
          onApply={this.handleApplyActiveFilter}
        />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    activeFilter: filterSelectors.getActiveFilter(state.filters, ownProps.namespace)
  }),
  filterActions
)(Filters);
