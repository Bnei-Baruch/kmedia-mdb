import { PLAYER_ACTIONS_BY_EVENT, actions } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { noop } from '../../helpers/utils';

export const LOCALSTORAGE_MUTE = 'jwplayer.mute';

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
/**
 * check if jwplayer builded, use if not need rerender on build
 * @returns {boolean}
 */
export const isPlayerReady = () => window.jwplayer()?.id === JWPLAYER_ID;

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
    console.log('playlistItem',e.item.sources[0]?.type)
    if (e.item.sources[0]?.type.toLowerCase() === 'hls') {
      player.stop();
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

