function KMediaPlayerApi(playerId, callbackFunc) {
	this.playerId = playerId;
	if (callbackFunc)
		window.addEventListener('message', callbackFunc, false);

	this.setPlayer = function(args) {
		let player = document.getElementById(this.playerId).contentWindow;
		player.postMessage(args, '*');
	}

	this.removeEventListener = function (callbackFunc) {
		window.removeEventListener('message', callbackFunc, false)
	}

	this.play = function() {
		this.setPlayer({command: 'play'});
	}

	this.stop = function (callback) {
		this.setPlayer({command: 'stop'});
	}

	this.pause = function pause(callback) {
		this.setPlayer({command: 'pause'});
	}

	this.exitFullscreen = function () {
		this.setPlayer({command: 'exitFullscreen'});
	}

	this.mute = function mute() {
		this.setPlayer({command: 'mute'});
	}

	this.muteUnmute = function() {
		this.setPlayer({command: 'muteUnmute'});
	}

	this.setVolume = function (volume) {
		this.setPlayer({command: 'setVolume', volume});
	}

	this.getVolume = function() {
		this.setPlayer({command: 'getVolume'});
	}

	this.getCurrentTime = function getCurrentTime() {
		this.setPlayer({command: 'currentTime'});
	}

	this.setCurrentTime = function (currentTime) {
		this.setPlayer({command: 'setCurrentTime', currentTime});
	}

	this.getInfo = function () {
		this.setPlayer({command: 'getInfo'});
	}

	this.isFullScreen = function () {
		this.setPlayer({command: 'isFullScreen'});
	}

	this.isLoading = function () {
		this.setPlayer({command: 'isLoading'});
	}

	this.isMuted = function () {
		this.setPlayer({command: 'isMuted'});
	}

	this.isPlaying = function () {
		this.setPlayer({command: 'isPlaying'});
	}

