import * as types from './actionTypes';
import LessonApi from '../api/lessonApi';
import initialState from '../reducers/initialState';

export function loadLessonsSuccess(lessons, pageNo) {
  return {
    type: types.LOAD_LESSONS_SUCCESS,
    lessons,
    pageNo
  };
}

export function loadLessons({ language, pageNo, pageSize }) {
  return dispatch => (
    LessonApi.all({ language, page_no: pageNo, page_size: pageSize })
      .then((lessons) => {
        dispatch(loadLessonsSuccess(lessons, pageNo));
      })
      .catch((error) => {
        throw error;
      })
  );
}

export function onSetPage(pageNo) {
  return dispatch => (
    LessonApi.all(
      {
        language : initialState.settings.language,
        page_no  : pageNo,
        page_size: initialState.settings.pageSize
      })
      .then((lessons) => {
        dispatch(loadLessonsSuccess(lessons, pageNo));
      })
      .catch((error) => {
        throw error;
      })
  );
}

