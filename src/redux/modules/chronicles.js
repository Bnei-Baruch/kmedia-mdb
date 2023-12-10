import { createSlice } from '@reduxjs/toolkit';
import { actions as recommended } from './recommended';
import { actions as search } from './search';
import { actions as player } from './player';

const onAction = (state, { payload }) => {
  state.actionsCount = state.actionsCount + 1;
  state.lastAction   = payload;
};

const chronicles = createSlice({
  name        : 'chronicles',
  initialState: {
    actionsCount: 0,
    lastAction  : null,
    event       : null
  },

  reducers     : {
    userInactive: () => ({}),
    pauseOnLeave: state => void (state.event = 'player-stop')
  },
  extraReducers: builder => {
    builder
      .addCase(recommended.fetchRecommendedSuccess, onAction)

      .addCase(search.autocompleteSuccess, onAction)
      .addCase(search.searchSuccess, onAction)

      .addCase(player.playerPlay, state => void (state.event = 'player-play'))
      .addCase(player.playerPause, state => void (state.event = 'player-stop'))
      .addCase(player.playerRemove, state => void (state.event = 'player-stop'))
      .addCase(player.playerToggleMute, state => void (state.event = 'mute-unmute'));
  }
});

export default chronicles.reducer;

export const { actions } = chronicles;

export const types = Object.fromEntries(new Map(
  Object.values(chronicles.actions).map(a => [a.type, a.type])
));

const getLastAction = state => state.lastAction;
const getEvent      = state => state.event;

export const selectors = {
  getLastAction,
  getEvent
};
