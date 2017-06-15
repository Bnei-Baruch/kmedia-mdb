import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import { actions as filterActions, selectors as filterSelectors } from '../../../redux/modules/filters';

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
    if (!this.props.isHydrated && nextProps.isHydrated) {
      this.props.onHydrated(this.props.namespace);
    }
  }

  render() {
    return <div />;
  }
}

export default connect(
  (state, ownProps) => ({
    isHydrated: filterSelectors.getIsHydrated(state.filters, ownProps.namespace)
  }),
  filterActions
)(FiltersHydrator);
