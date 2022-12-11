import { actions as playlistActions } from '../../redux/modules/playlist';
import { PLAYER_ACTIONS_BY_EVENT } from '../../redux/modules/player';
import { JWPLAYER_ID } from '../../helpers/consts';

const playerRef    = { current: null };
export const setup = (conf) => {
  const player = window.jwplayer(JWPLAYER_ID);
  player.setup(conf);
  playerRef.current = player;
};

export const init = (dispatch) => {
  playerRef.current = window.jwplayer(JWPLAYER_ID);
  initPlayerEvents(dispatch);
};

export const getDuration = () => playerRef.current?.getDuration() || 0;

export const getMute = () => playerRef.current?.getMute() || false;
export const setMute = () => playerRef.current?.setMute() || false;

export const setVolume = (vol) => playerRef.current?.setVolume(vol) || 0;

export const setPlaybackRate = (rate) => playerRef.current?.setPlaybackRate(rate) || 0;

export const getPosition = () => {
  return playerRef.current?.getPosition() || 0;
};

export const play = () => playerRef.current?.play() || false;

export const pause = () => playerRef.current?.pause() || false;

export const seek = (pos) => playerRef.current?.seek(pos) || false;

export const load = (items) => playerRef.current?.load(items) || false;

const PLAYER_EVENTS = ['ready', 'remove', 'play', 'pause', 'playbackRateChanged', 'resize', 'mute'];

const initPlayerEvents = (dispatch) => {
  const player = window.jwplayer();

  //for debug, catch all jwplayer events
  // player.on('all', (name, e) => console.log('jwplayer all events', name, e));

  player.on('error', e => console.error(e));

  player.on('remove', () => player.off('all'));

  player.on('complete', () => dispatch(playlistActions.next(true)));

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

