import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterPropShape } from '../shapes';
import { actions as filterActions, selectors as filterSelectors } from '../../redux/modules/filters';
import ActiveFilter from './ActiveFilter';
import FilterMenu from './FilterMenu';
import FiltersHydrator from './FiltersHydrator';
import FilterTags from './FilterTags';

class Filters extends Component {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    editNewFilter: PropTypes.func.isRequired,
    closeActiveFilter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(filterPropShape).isRequired,
    activeFilterName: PropTypes.string,
    rightItems: PropTypes.arrayOf(PropTypes.node),
  };

  static defaultProps = {
    activeFilterName: '',
    rightItems: null,
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
    this.props.onChange();
    this.handleCancelActiveFilter();
  };

  render() {
    const { filters, rightItems, activeFilterName, namespace, onHydrated, onChange } = this.props;

    return (
      <div>
        <FiltersHydrator namespace={namespace} onHydrated={onHydrated} />
        <FilterMenu
          items={filters}
          rightItems={rightItems}
          active={activeFilterName}
          onChoose={this.handleFilterClick}
        />
        <ActiveFilter
          namespace={namespace}
          activeFilterName={activeFilterName}
          filters={filters}
          onCancel={this.handleCancelActiveFilter}
          onApply={this.handleApplyActiveFilter}
        />
        <FilterTags namespace={namespace} onClose={onChange} />
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
