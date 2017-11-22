import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import { actions, selectors } from '../../../redux/modules/filters';

class FiltersHydrator extends Component {
  static propTypes = {
    hydrateFilters: PropTypes.func.isRequired,
    filtersHydrated: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
    onHydrated: PropTypes.func,
    isHydrated: PropTypes.bool
  };

  static defaultProps = {
    onHydrated: noop,
    isHydrated: false
  };

  componentDidMount() {
    // Filters hydration cycle starts here
    this.props.hydrateFilters(this.props.namespace);
  }

  componentWillReceiveProps(nextProps) {
    const { isHydrated, onHydrated, namespace, filtersHydrated } = nextProps;

    // isHydrated changed from false to true.
    if (!this.props.isHydrated && isHydrated) {

      // End the hydration cycle.
      // Everything is updated, sagas, redux, react. Down to here.
      filtersHydrated(namespace);

      // callback our event prop
      onHydrated(namespace);
    }
  }

  render() {
    return <div />;
  }
}

export default connect(
  (state, ownProps) => ({
    isHydrated: selectors.getIsHydrated(state.filters, ownProps.namespace)
  }),
  actions
)(FiltersHydrator);
