import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

export default class AVEditSlice extends Component {
  static propTypes = {
    onActivateSlice: PropTypes.func.isRequired,
  };

  render() {
    const { onActivateSlice } = this.props;

    return (
      <button
        type="button"
        tabIndex="-1"
        className="player-button player-control-edit-slice"
        onClick={onActivateSlice}
      >
        <Icon
          name="share alternate"
          style={{ margin: 0, height: '100%' }}
        />
      </button>
    );
  }
}
