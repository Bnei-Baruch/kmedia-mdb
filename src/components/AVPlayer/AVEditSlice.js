import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

export default class AVEditSlice extends Component {
  static propTypes = {
    onActivateSlice: PropTypes.func.isRequired,
    isActive: PropTypes.bool
  };

  render() {
    const { onActivateSlice, isActive } = this.props;

    return (
      <button
        type="button"
        tabIndex="-1"
        className="player-button player-control-edit-slice"
        style={isActive ? {backgroundColor: 'red'} : null}
        onClick={onActivateSlice}
      >
        <Icon name="share alternate" />
      </button>
    );
  }
}
