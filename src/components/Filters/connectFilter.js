import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectors as filterSelectors,
  actions as filterActions
} from '../../redux/modules/filters';

const connectFilter = (options = {}) => (WrappedComponent) => {
  const isMultiple = options.isMultiple;

  class ConnectFilterHOC extends Component {

    static propTypes = {
      namespace: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      stopEditingFilter: PropTypes.func.isRequired,
      setFilterValue: PropTypes.func.isRequired,
      addFilterValue: PropTypes.func.isRequired,
      removeFilterValue: PropTypes.func.isRequired,
      activeValueIndex: PropTypes.number,
      isEditing: PropTypes.bool
    };

    static defaultProps = {
      activeValueIndex: undefined,
      isEditing: false
    };

    componentWillUnmount() {
      this.props.stopEditingFilter(this.props.namespace, this.props.name);
    }

    updateValue = (value) => {
      const { isEditing, activeValueIndex, namespace, name } = this.props;
      if (isEditing) {
        this.props.setFilterValue(namespace, name, value, activeValueIndex);
      } else if (isMultiple) {
        this.props.addFilterValue(namespace, name, value);
      } else {
        this.props.setFilterValue(namespace, name, value);
      }
    };

    removeValue = () => {
      const { namespace, name, activeValueIndex } = this.props;
      this.props.removeFilterValue(namespace, name, activeValueIndex);
    };

    render() {
      console.log(this.props.value);
      const { addFilterValue, setFilterValue, removeFilterValue, ...rest } = this.props;
      return (
        <WrappedComponent
          updateValue={this.updateValue}
          removeValue={this.removeValue}
          {...rest}
        />
      );
    }
  }

  return connect(
    (state, ownProps) => ({
      isEditing: filterSelectors.getIsEditingExistingFilter(state.filters, ownProps.namespace, ownProps.name),
      activeValueIndex: filterSelectors.getActiveValueIndex(state.filters, ownProps.namespace, ownProps.name),
      value: filterSelectors.getActiveValue(state.filters, ownProps.namespace, ownProps.name)
    }),
    filterActions
  )(ConnectFilterHOC);

  // TODO (yaniv): change displayName
};

export default connectFilter;
