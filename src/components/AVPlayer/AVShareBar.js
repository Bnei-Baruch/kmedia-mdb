import React, { Component } from 'react';
import AVShare from './AVShare';
import AVShareLink from './AVShareLink';

export default class AVShareBar extends Component {
  render() {
    return (
      <div className="player-share-bar">
        <div className="player-share-bar__action">
          <AVShare />
        </div>
        <div className="player-share-bar__action">
          <AVShareLink />
        </div>
      </div>
    );
  }
}
