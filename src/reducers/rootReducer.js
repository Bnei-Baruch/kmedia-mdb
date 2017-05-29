import { combineReducers } from 'redux';

import lessons from './lessonsReducer';
import settings from './settingsReducer';

const rootReducer = combineReducers({
  settings,
  lessons,
});

export default rootReducer;
