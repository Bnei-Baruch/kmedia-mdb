import { createAction } from 'redux-actions';

const PLAYER_PLAY = 'PLAYER_PLAY';

export const types = {
  PLAYER_PLAY,
}

// Actions
const playerPlay = createAction(PLAYER_PLAY);

export const actions = {
  playerPlay,
};

