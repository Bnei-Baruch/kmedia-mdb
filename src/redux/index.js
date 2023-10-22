import { combineReducers } from 'redux';
import { reducer as assets } from '../../lib/redux/slices/assetSlice/assetSlice';
import { createRouterReducer as connectRouter } from '@lagunovsky/redux-react-router';
import { reducer as auth } from '../../lib/redux/slices/authSlice/authSlice';
import { reducer as bookmarkFilter } from './modules/bookmarkFilter';
import { reducer as chronicles } from './modules/chronicles';
import { reducer as events } from './modules/events';
import { reducer as filters } from '../../lib/redux/slices/filterSlice/filterSlice';
import { reducer as filtersAside } from '../../lib/redux/slices/filterSlice/filterStatsSlice';
import { reducer as lessons } from './modules/lessons';
import { reducer as likutim } from './modules/likutim';
import { reducer as lists } from '../../lib/redux/slices/listSlice/listSlice';
import { reducer as mdb } from '../../lib/redux/slices/mdbSlice/mdbSlice';
import { reducer as music } from '../../lib/redux/slices/musicSlice/musicSlice';
import { reducer as my } from '../../lib/redux/slices/mySlice/mySlice';
import { reducer as player } from '../../lib/redux/slices/playerSlice/playerSlice';
import { reducer as playlist } from '../../lib/redux/slices/playlistSlice/playlistSlice';
import { reducer as preparePage } from '../../lib/redux/slices/preparePageSlice/preparePageSlice';
import { reducer as publications } from '../../lib/redux/slices/publicationsSlice/thunks';
import { reducer as recommended } from './modules/recommended';
import { reducer as search } from '../../lib/redux/slices/searchSlice/searchSlice';
import { reducer as settings } from '../../lib/redux/slices/settingsSlice/settingsSlice';
import { reducer as simpleMode } from '../../lib/redux/slices/simpleMode/simpleModeSlice';
import { reducer as sources } from '../../lib/redux/slices/sourcesSlice/sourcesSlice';
import { reducer as stats } from './modules/stats';
import { reducer as tags } from '../../lib/redux/slices/tagsSlice/tagsSlice';
import { reducer as notes } from '../../lib/redux/slices/mySlice/myNotesSlice';
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
