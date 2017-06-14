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
    this.setState({ activeFilter: null });
  };

  handleApplyActiveFilter = () => {
    this.props.onFilterApplication();
  };

  render() {
    const { activeFilter } = this.props;

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

export default connect(
  (state, ownProps) => ({
    activeFilter: filterSelectors.getActiveFilter(state.filters, ownProps.namespace)
  }),
  filterActions
)(Filters);
