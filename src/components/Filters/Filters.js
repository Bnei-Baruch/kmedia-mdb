import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterPropShape } from '../shapes';
import { actions as filterActions, selectors as filterSelectors } from '../../redux/modules/filters';
import ActiveFilter from './ActiveFilter/ActiveFilter';
import FilterMenu from './FilterMenu/FilterMenu';

class Filters extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    onFilterApplication: PropTypes.func.isRequired,
    editNewFilter: PropTypes.func.isRequired,
    closeActiveFilter: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(filterPropShape).isRequired,
    activeFilterName: PropTypes.string
  };

  static defaultProps = {
    activeFilterName: ''
  };

  handleFilterClick = ({ name }) => {
    const { namespace } = this.props;
    this.props.editNewFilter(namespace, name);
  };

  handleCancelActiveFilter = () => {
    const { namespace, activeFilterName } = this.props;
    this.props.closeActiveFilter(namespace, activeFilterName);
  };

  handleApplyActiveFilter = () => {
    const { namespace, activeFilterName } = this.props;
    this.props.onFilterApplication();
    this.props.closeActiveFilter(namespace, activeFilterName);
  };

  render() {
    const { filters, activeFilterName, namespace } = this.props;

    return (
      <div>
        <FilterMenu items={filters} namespace={namespace} active={activeFilterName} onChoose={this.handleFilterClick} />
        <ActiveFilter
          namespace={namespace}
          activeFilterName={activeFilterName}
          filters={filters}
          onCancel={this.handleCancelActiveFilter}
          onApply={this.handleApplyActiveFilter}
        />
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    activeFilterName: filterSelectors.getActiveFilter(state.filters, ownProps.namespace),
  }),
  filterActions
)(Filters);
