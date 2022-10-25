import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { reducer as assets } from './modules/assets';
import { reducer as auth } from './modules/auth';
import { reducer as bookmarkFilter } from './modules/bookmarkFilter';
import { reducer as chronicles } from './modules/chronicles';
import { reducer as events } from './modules/events';
import { reducer as filters } from './modules/filters';
import { reducer as filtersAside } from './modules/filtersAside';
import { reducer as home } from './modules/home';
import { reducer as lessons } from './modules/lessons';
import { reducer as likutim } from './modules/likutim';
import { reducer as lists } from './modules/lists';
import { reducer as mdb } from './modules/mdb';
import { reducer as music } from './modules/music';
import { reducer as my } from './modules/my';
import { reducer as player } from './modules/player';
import { reducer as playlist } from './modules/playlist';
import { reducer as programs } from './modules/preparePage';
import { reducer as publications } from './modules/publications';
import { reducer as recommended } from './modules/recommended';
import { reducer as search } from './modules/search';
import { reducer as settings } from './modules/settings';
import { reducer as simpleMode } from './modules/simpleMode';
import { reducer as sources } from './modules/sources';
import { reducer as stats } from './modules/stats';
import { reducer as tags } from './modules/tags';
import { reducer as trim } from './modules/trim';

const reducers = history => combineReducers({
  router: connectRouter(history),
  settings,
  preparePage,
  events,
  lessons,
  publications,
  filters,
  filtersAside,
  lists,
  sources,
  tags,
  mdb,
  search,
  assets,
  home,
  stats,
  simpleMode,
  recommended,
  chronicles,
  music,
  auth,
  my,
  likutim,
  bookmarkFilter,
  trim,
  player,
  playlist
});

export default reducers;
