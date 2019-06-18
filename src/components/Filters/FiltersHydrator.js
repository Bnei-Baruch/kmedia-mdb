import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import { actions, selectors } from '../../redux/modules/filters';

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

  state = { isHydrated: false };

  componentDidMount() {
    // Filters hydration cycle starts here
    const { namespace, isHydrated, hydrateFilters, filtersHydrated } = this.props;

    // Filters were hydrated on SSR ?
    if (isHydrated) {
      // Short the circuit here.
      // We'll continue next time we mount.
      filtersHydrated(namespace);
    } else {
      hydrateFilters(namespace);
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { isHydrated, onHydrated, namespace } = props;

    // isHydrated changed from false to true.
    if (!state.isHydrated && isHydrated) {
      // End the hydration cycle.
      // Everything is updated, sagas, redux, react. Down to here.
      // callback our event prop
      onHydrated(namespace);
    }
    return { isHydrated };
  }

  componentWillUnmount() {
    const { filtersHydrated, namespace } = this.props;
    filtersHydrated(namespace);
  }

  render() {
    return <Fragment />;
  }
}

export default connect(
  (state, ownProps) => ({
    isHydrated: selectors.getIsHydrated(state.filters, ownProps.namespace)
  }),
  actions
)(FiltersHydrator);
