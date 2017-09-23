import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { PLAYER_MODE } from './constants';
import { playerModeProp } from './propTypes';

export default class AVShare extends Component {
  static propTypes = {
    onActivateSlice: playerModeProp.isRequired,
  };

  render() {
    const { onActivateSlice } = this.props;

    return (
      <button
        type="button"
        tabIndex="-1"
        className="player-button player-control-slice-toggle"
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
