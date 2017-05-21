import * as types from './actionTypes';
import LessonApi from '../api/lessonApi';

export function loadLessonsSuccess(lessons) {
  return {
    type: types.LOAD_LESSONS_SUCCESS,
    lessons
  };
}

export function loadLessons(args) {
  return dispatch => (
    LessonApi.getAllLessons(args)
      .then((lessons) => {
        dispatch(loadLessonsSuccess(lessons));
      })
      .catch((error) => {
        throw error;
      })
  );
}
