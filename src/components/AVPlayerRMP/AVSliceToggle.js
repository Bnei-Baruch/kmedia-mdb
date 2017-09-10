import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { PLAYER_MODE } from './constants';
import { playerModeProp } from './propTypes';

export default class AVSliceToggle extends Component {
  static propTypes = {
    playerMode: playerModeProp.isRequired,
    onToggle: PropTypes.func.isRequired
  };

  render() {
    const { playerMode, onToggle } = this.props;

    return (
      <button
        type="button"
        tabIndex="-1"
        className="player-button player-control-slice-toggle"
        onClick={onToggle}
      >
        <Icon
          name={playerMode === PLAYER_MODE.NORMAL ? 'cut' : 'video'}
          style={{ margin: 0, height: '100%' }}
        />
      </button>
    );
  }
}
