import { combineReducers } from 'redux';

import lessons from './lessonsReducer';

const rootReducer = combineReducers({
  lessons
});

export default rootReducer;
