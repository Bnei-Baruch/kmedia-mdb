import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player, playerSlice } from '../../redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES } from '../../../src/helpers/consts';
import { seek, getPosition, setVolume, getVolume, togglePlay, getDuration } from '../../../pkg/jwpAdapter/adapter';

export const useKeyboardControl = runTimeout => {
  const mode = useSelector(state => player.getOverMode(state.player));

  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.defaultPrevented || e.target.nodeName === 'INPUT' || e.target.nodeName === 'TEXTAREA') {
        return; // Do nothing if the event was already processed
      }

      const coef = e.shiftKey ? 3 : e.altKey ? 0.2 : 1;
      switch (e.key) {
        case 'Down': // IE/Edge specific value
        case 'ArrowDown': {
          const v = getVolume();
          setVolume(Math.max(0, v - coef * 5));
          break;
        }

        case 'Up': // IE/Edge specific value
        case 'ArrowUp': {
          const v = getVolume();
          setVolume(Math.min(100, v + coef * 5));
          break;
        }

        case 'Left': // IE/Edge specific value
        case 'ArrowLeft': {
          const pos = getPosition();
          seek(Math.max(pos - coef * 5, 0));
          break;
        }

        case 'Right': // IE/Edge specific value
        case 'ArrowRight': {
          const pos = getPosition();
          seek(Math.min(pos + coef * 5, getDuration()));
          break;
        }

        case 'Esc': // IE/Edge specific value
        case 'Escape':
          break;
        case ' ':
          togglePlay();
          break;
        default:
          return;
      }

      if (mode === PLAYER_OVER_MODES.active) {
        runTimeout(dispatch);
      }

      if (mode === PLAYER_OVER_MODES.none) {
        dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.active));
      }

      dispatch(playerSlice.actions.setKeyboardCoef(coef));
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  useEffect(() => {
    const handleKeyUp = e => {
      if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      dispatch(playerSlice.actions.setKeyboardCoef(1));
      e.preventDefault();
    };

    document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [mode]);

  return null;
};

