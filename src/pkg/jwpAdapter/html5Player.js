// HTML5 <video> + hls.js stand-in for the part of the JW Player API this adapter uses.
// Installs window.jwplayer, so adapter.js and the behaviors keep working unchanged.

const isHls = src => /\.m3u8(\?|$)/i.test(src);

let instance = null;

class Html5Player {
  constructor(id) {
    this.id        = id;
    this.listeners = {};
    // adapter.functionByName calls methods unbound
    Object.getOwnPropertyNames(Html5Player.prototype)
      .filter(k => k !== 'constructor')
      .forEach(k => (this[k] = this[k].bind(this)));
  }

  on(name, fn) {
    (this.listeners[name] = this.listeners[name] || []).push(fn);
    return this;
  }

  once(name, fn) {
    const wrap = e => {
      this.off(name, wrap);
      fn(e);
    };

    return this.on(name, wrap);
  }

  off(name, fn) {
    if (!name || name === 'all') this.listeners = {};
    else if (!fn) delete this.listeners[name];
    else this.listeners[name] = (this.listeners[name] || []).filter(f => f !== fn);
    return this;
  }

  trigger(name, e = {}) {
    (this.listeners[name] || []).slice().forEach(fn => fn({ type: name, ...e }));
  }

  setup({ playlist, preload = 'auto' }) {
    const container = document.getElementById(this.id);
    container.classList.add('jwplayer');

    const v = this.video = document.createElement('video');
    v.className = 'jw-video'; // adapter.pause() finds the element by this class
    v.preload   = preload;
    v.setAttribute('playsinline', '');
    container.appendChild(v);
    this.bindVideoEvents();

    this.resizeObserver = new ResizeObserver(([{ contentRect: { width, height } }]) => this.trigger('resize', { width, height }));
    this.resizeObserver.observe(container);

    Promise.resolve().then(() => this.trigger('ready'));
    return this.load(playlist);
  }

  load([item]) {
    const v    = this.video;
    const type = isHls(item.file) ? 'hls' : 'mp4';
    this.item  = { ...item, sources: [{ file: item.file, type }] };
    this.destroyHls();
    v.poster = item.image || '';

    const attach = Hls => {
      if (this.item?.file !== item.file) return; // replaced meanwhile
      if (Hls?.isSupported()) {
        v.disableRemotePlayback = true; // needed by ManagedMediaSource on iOS
        this.hls = new Hls();
        this.hls.on(Hls.Events.ERROR, (_, d) => d.fatal && this.trigger('error', { message: d.details }));
        this.hls.attachMedia(v);
        this.hls.loadSource(item.file);
      } else {
        v.src = item.file; // MP4, or native HLS
      }

      this.trigger('playlistItem', { index: 0, item: this.item });
    };

    if (type === 'hls') import('hls.js').then(m => attach(m.default));
    else Promise.resolve().then(() => attach());
    return this;
  }

  bindVideoEvents() {
    const v          = this.video;
    let { muted, volume } = v;
    let bufferFull   = false;
    const on         = (name, fn) => v.addEventListener(name, fn);

    on('loadstart', () => (bufferFull = false));
    on('loadedmetadata', () => {
      if (this.pendingSeek === undefined) return;
      v.currentTime    = this.pendingSeek;
      this.pendingSeek = undefined;
    });
    on('canplay', () => !bufferFull && (bufferFull = true) && this.trigger('bufferFull'));
    on('playing', () => this.trigger('play', { newstate: 'playing' }));
    on('pause', () => this.trigger('pause', { newstate: 'paused' }));
    on('waiting', () => this.trigger('buffer', { newstate: 'buffering' }));
    on('ended', () => this.trigger('complete'));
    on('timeupdate', () => this.trigger('time', { currentTime: v.currentTime, position: v.currentTime, duration: this.getDuration() }));
    on('progress', () => this.trigger('bufferChange', { bufferPercent: this.bufferPercent() }));
    on('ratechange', () => this.trigger('playbackRateChanged', { playbackRate: v.playbackRate }));
    on('volumechange', () => {
      if (v.muted !== muted) this.trigger('mute', { mute: (muted = v.muted) });
      if (v.volume !== volume) this.trigger('volume', { volume: Math.round((volume = v.volume) * 100) });
    });
    on('error', () => this.trigger('error', { message: v.error?.message, code: v.error?.code }));
    on('webkitendfullscreen', () => this.trigger('fullscreen', { fullscreen: false }));
  }

  bufferPercent() {
    const { buffered, currentTime } = this.video;
    const duration                  = this.getDuration();
    for (let i = 0; duration && i < buffered.length; i++) {
      if (buffered.start(i) <= currentTime && currentTime <= buffered.end(i)) return 100 * buffered.end(i) / duration;
    }

    return 0;
  }

  play() {
    this.video?.play()?.catch(e => {
      if (e.name !== 'NotAllowedError') return;
      this.trigger('autostartNotAllowed', { error: e });
      this.trigger('playAttemptFailed', { error: e });
    });
    return this;
  }

  pause() {
    this.video?.pause();
    return this;
  }

  stop() {
    this.pause();
    this.seek(0);
    return this;
  }

  seek(pos) {
    if (!this.video) return this;
    if (this.video.readyState < 1) this.pendingSeek = pos;
    else this.video.currentTime = pos;
    this.trigger('seek', { offset: pos, position: pos, duration: this.getDuration() });
    return this;
  }

  getPosition() {
    return this.video?.currentTime || 0;
  }

  getDuration() {
    const d = this.video?.duration;
    return Number.isFinite(d) ? d : 0;
  }

  getState() {
    const v = this.video;
    if (!v) return 'idle';
    if (v.ended) return 'complete';
    if (v.paused) return 'paused';
    return v.readyState < 3 ? 'buffering' : 'playing';
  }

  getMute() {
    return !!this.video?.muted;
  }

  setMute(val) {
    this.video.muted = val === undefined ? !this.video.muted : !!val;
    return this;
  }

  getVolume() {
    return Math.round((this.video?.volume ?? 1) * 100);
  }

  setVolume(vol) {
    this.video.volume = Math.min(1, Math.max(0, vol / 100));
    if (vol > 0) this.video.muted = false;
    return this;
  }

  setPlaybackRate(rate) {
    this.video.playbackRate = rate;
    return this;
  }

  getPlaylist() {
    return this.item ? [this.item] : [];
  }

  getPlaylistItem() {
    return this.item;
  }

  getAudioTracks() {
    if (this.hls) return this.hls.audioTracks.map(t => ({ language: t.lang, name: t.name }));
    return Array.from(this.video?.audioTracks || []).map(t => ({ language: t.language, name: t.label }));
  }

  setCurrentAudioTrack(idx) {
    if (idx < 0) return this;
    if (this.hls) this.hls.audioTrack = idx;
    else Array.from(this.video?.audioTracks || []).forEach((t, i) => (t.enabled = i === idx));
    return this;
  }

  // labels match VS_NAMES ('360p', '720p', '1080p'); -1 = auto
  getQualityLevels() {
    return this.hls ? this.hls.levels.map(l => ({ label: `${l.height}p` })) : [];
  }

  setCurrentQuality(idx) {
    if (this.hls) this.hls.currentLevel = idx;
    return this;
  }

  // subtitles are not supported yet
  getCaptionsList() {
    return [];
  }

  setCurrentCaptions() {
    return this;
  }

  setPip() {
    this.video?.requestPictureInPicture?.().catch(() => null);
    return this;
  }

  // iOS: native fullscreen of the <video> element
  setFullscreen(on) {
    on ? this.video?.webkitEnterFullscreen?.() : this.video?.webkitExitFullscreen?.();
    return this;
  }

  setControls(on) {
    this.video && (this.video.controls = !!on);
    return this;
  }

  destroyHls() {
    this.hls?.destroy();
    this.hls = null;
  }

  remove() {
    this.trigger('remove');
    this.off();
    this.destroyHls();
    this.resizeObserver?.disconnect();
    const v = this.video;
    if (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
      v.remove();
    }

    instance = null;
    return this;
  }
}

const jwplayer = id => {
  if (id && !instance) instance = new Html5Player(id);
  return instance || {};
};

if (typeof window !== 'undefined') window.jwplayer = jwplayer;
