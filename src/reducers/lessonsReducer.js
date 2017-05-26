import * as types from '../actions/actionTypes';
import initialState from './initialState';
import { getPageNo } from '../components/router';

export default function lessonsReducer(state = { lessons: initialState.lessons, pageNo: initialState.pageNo }, action) {
  if (action.type === types.LOAD_LESSONS_SUCCESS) {
    return action.lessons;
  } else if (action.type === types.ROUTER_LOCATION_CHANGE) {
    const {pathname, search} = action.payload;
    if (pathname === '/lessons') {
      const pageNo = getPageNo(search);
      if (pageNo !== state.pageNo) { // Page Number was changed
        // this.props.actions.loadLessons({
        //   language : initialState.settings.language,
        //   page_no  : pageNo,
        //   page_size: initialState.settings.pageSize
        // });
      }
    }
    return state;
  }

  return state;
}
