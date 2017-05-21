import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function lessonsReducer(state = initialState.lessons, action) {
  switch (action.type) {
  case types.LOAD_LESSONS_SUCCESS:
    return action.lessons;
  default:
    return state;
  }
}
