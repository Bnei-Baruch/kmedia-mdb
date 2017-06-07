import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as filterActions } from '../../../redux/modules/filters';

class FiltersHydrator extends Component {
  static propTypes = {
    hydrateFilters: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null
  };

  componentDidMount() {
    this.props.hydrateFilters(this.props.namespace);
  }

  render() {
    return <div />;
  }
}

export default connect(
  null,
  filterActions
)(FiltersHydrator);
