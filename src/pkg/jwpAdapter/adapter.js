import { PLAYER_ACTIONS_BY_EVENT, actions } from '../../redux/modules/player';
import { JWPLAYER_ID, VS_NAMES } from '../../helpers/consts';
import { noop } from '../../helpers/utils';
import logger from '../../helpers/logger';

export const LOCALSTORAGE_MUTE    = 'jwplayer.mute';
export const LOCALSTORAGE_QUALITY = 'jwplayer.qualityLabel';
export const getQualitiesFromLS   = () => {
  const lsKey = localStorage.getItem(LOCALSTORAGE_QUALITY);
  const pair  = Object.entries(VS_NAMES).find(([k, v]) => lsKey === v);
  return pair?.[0];
};

export const setup = conf => {
  const jwp = window.jwplayer(JWPLAYER_ID);
  jwp.setup(conf);
};

const functionByName = (name, def = 0, val) => {
  const jwp = window.jwplayer();
  if (!jwp?.id) {
    return def;
  }

  const foo = jwp[name];
  let resp  = def;
  try {
    resp = foo(val);
  } catch (e) {
    logger.error('jwplayer error', e);
  }

  return resp;
};

export const getDuration = () => functionByName('getDuration');

export const getMute = () => functionByName('getMute', false);
export const setMute = val => functionByName('setMute', noop, val);

export const setVolume = vol => functionByName('setVolume', noop, vol);
export const getVolume = () => functionByName('getVolume', noop);

export const setPlaybackRate = rate => functionByName('setPlaybackRate', noop, rate);

export const getPosition     = () => functionByName('getPosition');
export const getPlaylistItem = () => functionByName('getPlaylistItem', noop);

export const play = () => functionByName('play');
export const stop = () => functionByName('stop');

//export const pause      = () => functionByName('pause', false);
export const pause      = () => document.getElementsByClassName('jw-video')[0]?.pause();
export const togglePlay = () => {
  const state = functionByName('getState');
  if (!state) return;

  (state !== 'playing') ? play() : pause();
};

export const seek = pos => functionByName('seek', noop, pos);

export const load = items => functionByName('load', noop, items);

export const remove        = () => functionByName('remove', noop);
export const setPip        = () => functionByName('setPip', noop, true);
/**
 * check if jwplayer builded, use if not need rerender on build
 * @returns {boolean}
 */
export const isPlayerReady = () => window.jwplayer()?.id === JWPLAYER_ID;

// Playback timing for chronicles, per play segment (play intent -> player-stop) of the loaded file:
// click_to_play_ms (intent -> first `time` tick while playing), first_frame_ms (intent -> JWP firstFrame, once per file),
// rebuffering (stalls after the start, seeks excluded) and start_trigger (auto = the page's own play, user = the rest).
// performance.now() based. See init() below.
let _t = {};
const closeStall = () => {
  if (_t.buffAt == null) return;
  _t.rm     = (_t.rm || 0) + (performance.now() - _t.buffAt);
  _t.buffAt = null;
};

// Returns the current segment's timing and starts a new segment. {} = unknown: src is no longer the loaded file
// (a stale stop must not reset the new file's segment), or nothing was asked for or played.
// click_to_play_ms: null = never started; omitted = no play intent seen (e.g. resumed from OS media keys).
export const takePlayTiming = src => {
  if (_t.src !== src) return {};
  const { intentAt, started, trigger = 'user', ctp = null, ff, rc = 0, rm = 0, buffAt } = _t;
  _t = { src };
  if (intentAt == null && !started) return {};
  return {
    start_trigger: trigger,
    ...(intentAt != null ? { click_to_play_ms: ctp } : {}),
    ...(ff != null ? { first_frame_ms: ff } : {}),
    rebuffer_count: rc,
    rebuffer_ms   : Math.round(rm + (buffAt != null ? performance.now() - buffAt : 0))
  };
};

// The page's own seek/play (BehaviorStartPlay) is about to start an idle player: its beforePlay is "auto".
// Not when paused: a seek there fires no beforePlay, and the mark would stick to the user's next play.
// Not after a user switch (audio/video, another unit) while playing or paused: that start is the user's.
export const markAutoStart = () => {
  if (window.jwplayer().getState() === 'idle' && !_t.switched) _t.autoNext = true;
};

const PLAYER_EVENTS = [
  'ready',
  'playlistItem',
  'remove',
  'destroyPlugin',
  'bufferFull',

  'play',
  'pause',

  'playbackRateChanged',
  'resize',
  'mute',
  'complete',
  'buffer'
];
export const init   = (dispatch, deviceInfo) => {
  const player = window.jwplayer();
  //for debug, catch all jwplayer events
  /*player.on('all', (name, e) => {
    if (!['bufferChange', 'time'].includes(name)) {
      console.log('bag: jwplayer all events', name, e);
    }
  });*/

  player.on('error', e => {
    logger.error(e);
    dispatch(actions.setLoaded(true));
  });

  player.on('warning', e => {
    logger.error(e);
    dispatch(actions.setLoaded(true));
  });

  player.on('remove', () => player.off('all'));

  // Chronicles playback timing (separate listeners; JWP allows many per event).
  player.on('beforePlay', () => {     // play intent; a user play after the page's own (auto) one starts a new segment
    if (['playing', 'buffering'].includes(player.getState())) return;   // e.g. a 2nd play() while starting: no new intent
    if (!_t.autoNext && _t.trigger === 'auto') _t = { src: _t.src };
    _t.trigger  = _t.autoNext ? 'auto' : 'user';
    _t.autoNext = false;
    _t.intentAt = performance.now();
  });
  player.on('playAttemptFailed', () => void (_t = { src: _t.src }));   // e.g. autoplay blocked: nothing was started
  player.on('firstFrame', () => {    // not JWP's loadTime: it restarts at every play() call; a seek's frame while paused isn't a start
    if (_t.intentAt != null && player.getState() === 'playing') _t.ff = Math.round(performance.now() - _t.intentAt);
  });
  player.on('seek', () => {           // a stall open at the seek ends there; buffering until `seeked` is not a stall
    closeStall();
    _t.seeking = true;
  });
  player.on('seeked', () => void (_t.seeking = false));
  player.on('buffer', () => {         // stall begins (only after playback has started, not caused by a seek)
    if (_t.started && _t.buffAt == null && !_t.seeking) {
      _t.buffAt = performance.now();
      _t.rc     = (_t.rc || 0) + 1;
    }
  });
  player.on('time', () => {           // first tick while playing = perceived start (a seek's position tick doesn't count)
    if (player.getState() !== 'playing') return;
    if (!_t.started) {
      _t.started = true;
      if (_t.intentAt != null) _t.ctp = Math.round(performance.now() - _t.intentAt);
    }

    closeStall();
  });

  player.on('playlistItem', e => {    // new file: reset timing first, so the HLS autoplay's beforePlay starts its segment
    const hls   = e.item.sources[0]?.type.toLowerCase() === 'hls';
    const state = player.getState();
    // The page's own start: JWP playing the next unit after `complete`, or the HLS autoplay on page load (idle).
    // Not a reload after a user switch (audio/video) while playing or paused.
    _t = {
      src     : e.item.file,
      autoNext: state === 'complete' || (hls && state === 'idle'),
      switched: ['playing', 'paused'].includes(state)
    };
    if (hls) player.play();
  });

  dispatch(actions.setIsMuted(localStorage.getItem(LOCALSTORAGE_MUTE) === 'true'));
  PLAYER_EVENTS.forEach(name => {
    const action = PLAYER_ACTIONS_BY_EVENT[name];
    if (!action) {
      logger.log(`no redux for action: ${name}`);
      return;
    }

    player.on(name, e => {
      dispatch(action(e));
    });
  });
};

