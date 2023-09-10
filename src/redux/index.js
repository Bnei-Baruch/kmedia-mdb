import { combineReducers } from 'redux';
import { reducer as assets } from './modules/assets';
import { createRouterReducer as connectRouter } from '@lagunovsky/redux-react-router';
import { reducer as auth } from '../../lib/redux/slices/authSlice/authSlice';
import { reducer as bookmarkFilter } from './modules/bookmarkFilter';
import { reducer as chronicles } from './modules/chronicles';
import { reducer as events } from './modules/events';
import { reducer as filters } from './modules/filters';
import { reducer as filtersAside } from './modules/filtersAside';
import { reducer as lessons } from './modules/lessons';
import { reducer as likutim } from './modules/likutim';
import { reducer as lists } from './modules/lists';
import { reducer as mdb } from '../../lib/redux/slices/mdbSlice/mdbSlice';
import { reducer as music } from './modules/music';
import { reducer as my } from './modules/my';
import { reducer as player } from './modules/player';
import { reducer as playlist } from './modules/playlist';
import { reducer as preparePage } from './modules/preparePage';
import { reducer as publications } from '../../lib/redux/slices/publicationsSlice/thunks';
import { reducer as recommended } from './modules/recommended';
import { reducer as search } from '../../lib/redux/slices/searchSlice/searchSlice';
import { reducer as settings } from '../../lib/redux/slices/settingsSlice/settingsSlice';
import { reducer as simpleMode } from './modules/simpleMode';
import { reducer as sources } from '../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { reducer as stats } from './modules/stats';
import { reducer as tags } from '../../lib/redux/slices/tagsSlice/tagsSlice';
import { reducer as notes } from './modules/myNotes';
import { reducer as trim } from '../../lib/redux/slices/trimSlice/trimSlice';
import { reducer as fetchImage } from '../../lib/redux/slices/imageSlice/imageSlice';

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
  stats,
  simpleMode,
  recommended,
  chronicles,
  music,
  auth,
  my,
  notes,
  likutim,
  bookmarkFilter,
  trim,
  player,
  playlist,
  fetchImage
});

export default reducers;
