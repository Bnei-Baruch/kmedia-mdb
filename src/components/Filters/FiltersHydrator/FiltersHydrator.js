import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import { actions, selectors } from '../../../redux/modules/filters';

class FiltersHydrator extends Component {
  static propTypes = {
    hydrateFilters: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
    onHydrated: PropTypes.func,
    isHydrated: PropTypes.bool
  };

  static defaultProps = {
    onHydrated: noop,
    isHydrated: false
  };

  componentDidMount() {
    this.props.hydrateFilters(this.props.namespace);
  }

  componentWillReceiveProps(nextProps) {
    const { isHydrated, onHydrated, namespace } = nextProps;
    if (!this.props.isHydrated && isHydrated) {
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
