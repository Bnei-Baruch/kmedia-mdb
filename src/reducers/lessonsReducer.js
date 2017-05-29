import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function lessonsReducer(state = { lessons: initialState.lessons, pageNo: initialState.pageNo }, action) {
  switch (action.type) {
  case types.LOAD_LESSONS_SUCCESS:
    return {
      ...state,
      lessons: action.lessons,
      pageNo: action.pageNo
  };
  case types.SET_LESSONS_PAGE:
    return {
      ...state,
      pageNo: action.pageNo
    };
  default:
    return state;
  }
}
