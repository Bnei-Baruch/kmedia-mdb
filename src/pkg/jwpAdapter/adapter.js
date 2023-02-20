import { PLAYER_ACTIONS_BY_EVENT } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';
import { noop } from '../../helpers/utils';
import isFunction from 'lodash/isFunction';

export const LOCALSTORAGE_MUTE = 'jwplayer.mute';

const playerRef    = { current: null };
export const setup = conf => {
  const player = window.jwplayer(JWPLAYER_ID);
  player.setup(conf);
  playerRef.current = player;
};

const functionByName = (name, def = 0, val) => {
  const foo = playerRef.current?.[name];
  if (!isFunction(foo))
    return def;
  let resp = def;
  try {
    resp = foo(val);
  } catch (e) {
    console.log('jwplayer error', e);
  }

  return resp;
};

export const getDuration = () => functionByName('getDuration');

export const getMute = () => functionByName('getMute', false);
export const setMute = (val) => functionByName('setMute', noop, val);

export const setVolume = (vol) => functionByName('setVolume', noop, vol);
export const getVolume = () => functionByName('getVolume', noop);

export const setPlaybackRate = (rate) => functionByName('setPlaybackRate', noop, rate);

export const getPosition = () => functionByName('getPosition');

export const play = () => functionByName('play');

export const pause      = () => functionByName('pause', false);
export const togglePlay = () => {
  const state = functionByName('getState');
  if (!state) return;
  (state !== 'playing') ? play() : pause();
};

export const seek = (pos) => functionByName('seek', noop, pos);

export const load = (items) => functionByName('load', noop, items);

export const remove = () => functionByName('remove', noop);

export const init = (dispatch) => {
  playerRef.current = window.jwplayer(JWPLAYER_ID);
  initPlayerEvents(dispatch);
};

const PLAYER_EVENTS    = ['ready', 'remove', 'play', 'pause', 'playbackRateChanged', 'resize', 'mute', 'complete'];
const initPlayerEvents = (dispatch) => {
  const player = window.jwplayer();

  //for debug, catch all jwplayer events
  //player.on('all', (name, e) => console.log('jwplayer all events', name, e));

  player.on('error', e => console.error(e));

  player.on('remove', () => player.off('all'));

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

