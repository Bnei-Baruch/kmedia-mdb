import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as settings } from './modules/settings';
import { reducer as events } from './modules/events';
import { reducer as lessons } from './modules/lessons';
import { reducer as programs } from './modules/programs';
import { reducer as publications } from './modules/publications';
import { reducer as filters } from './modules/filters';
import { reducer as lists } from './modules/lists';
import { reducer as sources } from './modules/sources';
import { reducer as tags } from './modules/tags';
import { reducer as mdb } from './modules/mdb';
import { reducer as search } from './modules/search';
import { reducer as assets } from './modules/assets';
import { reducer as home } from './modules/home';
import { reducer as stats } from './modules/stats';
import { reducer as simpleMode } from './modules/simpleMode';
import { reducer as recommended } from './modules/recommended';

export default history => combineReducers({
  router: connectRouter(history),
  settings,
  programs,
  events,
  lessons,
  publications,
  filters,
  lists,
  sources,
  tags,
  mdb,
  search,
  assets,
  home,
  stats,
  simpleMode,
  recommended
});
