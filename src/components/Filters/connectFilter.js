import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { actions, selectors } from '../../redux/modules/filters';
import { selectors as settings } from '../../redux/modules/settings';

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
      t: PropTypes.func.isRequired,
      language: PropTypes.string.isRequired,
      activeValueIndex: PropTypes.number,
      isEditing: PropTypes.bool
    };

    static defaultProps = {
      activeValueIndex: undefined,
      isEditing: false
    };

    componentWillUnmount() {
      const { name, namespace, stopEditingFilter } = this.props;
      stopEditingFilter(namespace, name);
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
      const { namespace, name, activeValueIndex, removeFilterValue } = this.props;
      removeFilterValue(namespace, name, activeValueIndex);
    };

    render() {
      // eslint-disable-next-line no-unused-vars
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
      isEditing: selectors.getIsEditingExistingFilter(state.filters, ownProps.namespace, ownProps.name),
      activeValueIndex: selectors.getActiveValueIndex(state.filters, ownProps.namespace, ownProps.name),
      value: selectors.getActiveValue(state.filters, ownProps.namespace, ownProps.name),
      allValues: selectors.getFilterAllValues(state.filters, ownProps.namespace, ownProps.name),
      language: settings.getLanguage(state.settings),
    }),
    actions
  )(translate()(ConnectFilterHOC));

  // TODO (yaniv): change displayName
};

export default connectFilter;
