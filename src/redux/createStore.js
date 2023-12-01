import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware, { END } from 'redux-saga';

import { rootSaga } from '../sagas';
import sagaMonitor from '../sagas/helpers/sagaMonitor';

import createMultiLanguageRouterMiddleware from './middleware/multiLanguageRouterMiddleware';
import { createRouterReducer as connectRouter } from '@lagunovsky/redux-react-router';
import { reducer as settings } from './modules/settings';
import { reducer as preparePage } from './modules/preparePage';
import { reducer as events } from './modules/events';
import { reducer as lessons } from './modules/lessons';
import { reducer as publications } from './modules/publications';
import { reducer as filters } from './modules/filters';
import { reducer as filtersAside } from './modules/filtersAside';
import { reducer as lists } from './modules/lists';
import { reducer as sources } from './modules/sources';
import { reducer as tags } from './modules/tags';
import { reducer as mdb } from './modules/mdb';
import { reducer as search } from './modules/search';
import assets from './modules/assets';
import { reducer as home } from './modules/home';
import { reducer as stats } from './modules/stats';
import { reducer as simpleMode } from './modules/simpleMode';
import { reducer as recommended } from './modules/recommended';
import { reducer as chronicles } from './modules/chronicles';
import { reducer as music } from './modules/music';
import { reducer as auth } from './modules/auth';
import { reducer as my } from './modules/my';
import { reducer as notes } from './modules/myNotes';
import { reducer as likutim } from './modules/likutim';
import { reducer as bookmarkFilter } from './modules/bookmarkFilter';
import { reducer as trim } from './modules/trim';
import { reducer as player } from './modules/player';
import { reducer as playlist } from './modules/playlist';
import { reducer as fetchImage } from './modules/fetchImage';

const isProduction = process.env.NODE_ENV === 'production';

const sagaMiddleware = createSagaMiddleware(
  isProduction ? {} : { sagaMonitor: sagaMonitor(), logger: console.log }
);

const setupMiddleware = history => getDefaultMiddleware => {
  const middleware = getDefaultMiddleware({
    serializableCheck : false,
    immutableCheck    : false,
    actionCreatorCheck: false
  }).concat(
    createMultiLanguageRouterMiddleware(history),
    sagaMiddleware
  );
  // Conditionally add another middleware in dev
  if (!isProduction) {
    middleware.push(logger);
  }

  return middleware;
};

const setupReducers = history => ({
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
  notes,
  likutim,
  bookmarkFilter,
  trim,
  player,
  playlist,
  fetchImage
});

export default function createStore(preloadedState, history) {
  console.log('configureStore, apply middleware');
  const store = configureStore({
    preloadedState,
    reducer   : setupReducers(history),
    middleware: setupMiddleware(history),
    // Turn off devtools in prod, or pass options in dev
    devTools: !isProduction
  });

  // used server side
  store.rootSagaPromise = sagaMiddleware.run(rootSaga).done;
  store.stopSagas       = () => store.dispatch(END);
  store.sagaMiddleWare  = sagaMiddleware;

  return store;
}
