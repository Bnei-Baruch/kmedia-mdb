import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import { actions, selectors } from '../../redux/modules/filters';

class FiltersHydrator extends Component {
  static propTypes = {
    hydrateFilters: PropTypes.func.isRequired,
    filtersHydrated: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
    onHydrated: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    isHydrated: PropTypes.bool
  };

  static defaultProps = {
    onHydrated: noop,
    isHydrated: false
  };

  state = { isHydrated: null };

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
    this.setState({ isHydrated });
  }

  static getDerivedStateFromProps(props, state) {
    const { isHydrated, onHydrated, namespace, filtersHydrated } = props;

    // isHydrated changed from false to true.
    if (!state.isHydrated && isHydrated) {
      // End the hydration cycle.
      // Everything is updated, sagas, redux, react. Down to here.
      filtersHydrated(namespace);

      // callback our event prop
      onHydrated(namespace);
    }
    return { isHydrated: true };
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
