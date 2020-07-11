function KMediaPlayerApi(playerId, callbackFunc) {
  this.playerId = playerId;
  if (callbackFunc) {
    window.addEventListener('message', callbackFunc, false);
  }
  this.removeEventListener = (callbackFunc) => {
    if (callbackFunc) {
      window.removeEventListener('message', callbackFunc, false);
    }
  };
  this.setPlayer           = (args) => {
    const playerElement = document.getElementById(this.playerId);
    if (!playerElement || !playerElement.contentWindow) {
      throw 'Player element "' + this.playerId + '" not found';
    }
    playerElement.contentWindow.postMessage(args, '*');
  };

  this.play           = () => this.setPlayer({ command: 'play' });
  this.stop           = () => this.setPlayer({ command: 'stop' });
  this.pause          = () => this.setPlayer({ command: 'pause' });
  this.exitFullscreen = () => this.setPlayer({ command: 'exitFullscreen' });
  this.mute           = () => this.setPlayer({ command: 'mute' });
  this.muteUnmute     = () => this.setPlayer({ command: 'muteUnmute' });
  this.setVolume      = (volume) => this.setPlayer({ command: 'setVolume', volume });
  this.getVolume      = () => this.setPlayer({ command: 'getVolume' });
  this.getCurrentTime = () => this.setPlayer({ command: 'currentTime' });
  this.setCurrentTime = (currentTime) => this.setPlayer({ command: 'setCurrentTime', currentTime });
  this.getInfo        = () => this.setPlayer({ command: 'getInfo' });
  this.isFullScreen   = () => this.setPlayer({ command: 'isFullScreen' });
  this.isLoading      = () => this.setPlayer({ command: 'isLoading' });
  this.isMuted        = () => this.setPlayer({ command: 'isMuted' });
  this.isPlaying      = () => this.setPlayer({ command: 'isPlaying' });
}
