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
// click_to_play_ms (intent -> first `time` tick while playing) and rebuffering (stalls after the start, seeks excluded).
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
  const { intentAt, started, ctp = null, rc = 0, rm = 0, buffAt } = _t;
  _t = { src };
  if (intentAt == null && !started) return {};
  return {
    ...(intentAt != null ? { click_to_play_ms: ctp } : {}),
    rebuffer_count: rc,
    rebuffer_ms   : Math.round(rm + (buffAt != null ? performance.now() - buffAt : 0))
  };
};

// A programmatic play is about to be paused (no autostart): the user never asked for this segment,
// so its `pause` (after the last `time` tick) discards it. Only if playing: otherwise no pause event comes.
export const dropPlayIntent = () => {
  if (['playing', 'buffering'].includes(window.jwplayer().getState())) _t.dropped = true;
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
  player.on('beforePlay', () => {     // play intent (incl. autoplay); the last one before the start counts
    _t.intentAt = performance.now();
    _t.dropped  = false;
  });
  player.on('pause', () => {
    if (_t.dropped) _t = { src: _t.src };
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
    _t = { src: e.item.file };
    if (e.item.sources[0]?.type.toLowerCase() === 'hls') {
      player.play();
    }
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

