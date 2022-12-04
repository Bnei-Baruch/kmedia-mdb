import { noop } from 'lodash/util';
import { actions as playlistActions } from '../../redux/modules/playlist';
import { PLAYER_ACTIONS_BY_EVENT } from '../../redux/modules/player';

export const getDuration = window.jwplayer()?.getDuration || noop;

export const getMute = window.jwplayer()?.getMute || noop;
export const setMute = window.jwplayer()?.setMute || noop;

export const setVolume = window.jwplayer()?.setVolume || noop;

export const setPlaybackRate = window.jwplayer()?.setPlaybackRate || noop;

export const getPosition = window.jwplayer()?.getPosition || noop;

export const play = window.jwplayer()?.play || noop;

export const pause = window.jwplayer()?.pause || noop;

export const seek = window.jwplayer()?.seek || noop;

const PLAYER_EVENTS = ['ready', 'remove', 'play', 'pause', 'playbackRateChanged', 'resize', 'mute'];

export const initPlayerEvents = (dispatch) => {
  const player = window.jwplayer();

  //for debug, catch all jwplayer events
  //player.on('all', (name, e) => console.log('jwplayer all events', name, e));

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
