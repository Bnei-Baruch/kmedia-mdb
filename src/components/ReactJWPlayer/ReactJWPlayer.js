import React, { Component } from 'react';
import PropTypes from 'prop-types';

import createEventHandlers from './create-event-handlers';
import getCurriedOnLoad from './helpers/get-curried-on-load';
import getPlayerOpts from './helpers/get-player-opts';
import initialize from './helpers/initialize';
import installPlayerScript from './helpers/install-player-script';

class ReactJWPlayer extends Component {
  constructor(props) {
    super(props);
    this.state          = {
      adHasPlayed: false,
      hasPlayed: false,
      hasFired: {},
    };
    this.eventHandlers  = createEventHandlers(this);
    this.uniqueScriptId = 'jw-player-script';
    this._initialize    = this._initialize.bind(this);
  }

  componentDidMount() {
    const isJWPlayerScriptLoaded = !!window.jwplayer;
    if (isJWPlayerScriptLoaded) {
      this._initialize();
      return;
    }

    const existingScript = document.getElementById(this.uniqueScriptId);

    if (!existingScript) {
      installPlayerScript({
        context: document,
        onLoadCallback: this._initialize,
        scriptSrc: this.props.playerScript,
        uniqueScriptId: this.uniqueScriptId,
      });
    } else {
      existingScript.onload = getCurriedOnLoad(existingScript, this._initialize);
    }
  }

  _initialize() {
    const component  = this;
    const player     = window.jwplayer(this.props.playerId);
    const playerOpts = getPlayerOpts(this.props);

    initialize({ component, player, playerOpts });
  }

  componentWillReceiveProps(nextProps) {
    const component  = this;
    const player     = window.jwplayer(this.props.playerId);
    const playerOpts = getPlayerOpts(nextProps);

    if (this.state.hasPlayed) {
      playerOpts.autostart = true;
    }
    initialize({ component, player, playerOpts });
  }

  render() {
    return (
      <div className={this.props.className} id={this.props.playerId} />
    );
  }
}

const noOp = () => {
};

ReactJWPlayer.propTypes = {
  aspectRatio: PropTypes.oneOf(['inherit', '1:1', '16:9']),
  className: PropTypes.string,
  customProps: PropTypes.object,
  file: PropTypes.string,
  image: PropTypes.string,
  onAdPlay: PropTypes.func,
  onAdResume: PropTypes.func,
  onEnterFullScreen: PropTypes.func,
  onExitFullScreen: PropTypes.func,
  onMute: PropTypes.func,
  onUnmute: PropTypes.func,
  onAutoStart: PropTypes.func,
  onResume: PropTypes.func,
  onPlay: PropTypes.func,
  generatePrerollUrl: PropTypes.func,
  onError: PropTypes.func,
  playerId: PropTypes.string.isRequired,
  playlist: PropTypes.string,
  onReady: PropTypes.func,
  onAdPause: PropTypes.func,
  onPause: PropTypes.func,
  onVideoLoad: PropTypes.func,
  playerScript: PropTypes.string.isRequired,
  onOneHundredPercent: PropTypes.func,
  onThreeSeconds: PropTypes.func,
  onTenSeconds: PropTypes.func,
  onThirtySeconds: PropTypes.func,
  onFiftyPercent: PropTypes.func,
  onNinetyFivePercent: PropTypes.func,
  isMuted: PropTypes.bool,
  isAutoPlay: PropTypes.bool,
};

ReactJWPlayer.defaultProps = {
  aspectRatio: 'inherit',
  file: '',
  isAutoPlay: false,
  isMuted: false,
  onAdPlay: noOp,
  onAdResume: noOp,
  onEnterFullScreen: noOp,
  onExitFullScreen: noOp,
  onMute: noOp,
  onUnmute: noOp,
  onAutoStart: noOp,
  onResume: noOp,
  onPlay: noOp,
  onClose: noOp,
  onReady: noOp,
  onError: noOp,
  onAdPause: noOp,
  onPause: noOp,
  onVideoLoad: noOp,
  onOneHundredPercent: noOp,
  onThreeSeconds: noOp,
  onTenSeconds: noOp,
  onThirtySeconds: noOp,
  onFiftyPercent: noOp,
  onNinetyFivePercent: noOp,
  playlist: '',
};

export default ReactJWPlayer;
