import { PLAYER_ACTIONS_BY_EVENT, actions } from '../../lib/redux/slices/playerSlice/playerSlice';
import { JWPLAYER_ID, VS_NAMES } from '../../src/helpers/consts';
import { noop } from '../../src/helpers/utils';
import isFunction from 'lodash/isFunction';

export const LOCALSTORAGE_MUTE    = 'jwplayer.mute';
export const LOCALSTORAGE_QUALITY = 'jwplayer.qualityLabel';
export const getQualitiesFromLS   = () => {
  const lsKey = localStorage.getItem(LOCALSTORAGE_QUALITY);
  const pair  = Object.entries(VS_NAMES).find(([k, v]) => {
    return lsKey === v;
  });
  return pair?.[0];
};

export const setup = conf => {
  const jwp = window.jwplayer(JWPLAYER_ID);
  jwp.setup(conf);
};

const functionByName = (name, def = 0, val) => {
  if (typeof window === 'undefined' || !isFunction(window.jwplayer))
    return def;
  const jwp = window.jwplayer();
  if (!jwp?.id) {
    return def;
  }

  const foo = jwp[name];
  let resp  = def;
  try {
    resp = foo(val);
  } catch (e) {
    console.log('jwplayer error', e);
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

export const pause      = () => functionByName('pause', false);
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
export const isPlayerReady = () => typeof window !== 'undefined' && isFunction(window.jwplayer) && window.jwplayer()?.id === JWPLAYER_ID;

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
    console.error(e);
    dispatch(actions.setLoaded(true));
  });

  player.on('warning', e => {
    console.error(e);
    dispatch(actions.setLoaded(true));
  });

  player.on('remove', () => player.off('all'));

  player.on('playlistItem', e => {
    if (e.item.sources[0]?.type.toLowerCase() === 'hls') {
      player.play();
    }
  });

  dispatch(actions.setIsMuted(localStorage.getItem(LOCALSTORAGE_MUTE) === 'true'));
  PLAYER_EVENTS.forEach(name => {
    const action = PLAYER_ACTIONS_BY_EVENT[name];
    if (!action) {
      console.log(`no redux for action: ${name}`);
      return;
    }

    player.on(name, e => {
      dispatch(action(e));
    });
  });
};

