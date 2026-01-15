import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import createSagaMiddleware, { END } from 'redux-saga';

import { rootSaga } from '../sagas';
import sagaMonitor from '../sagas/helpers/sagaMonitor';

import { createRouterReducer as connectRouter } from '@lagunovsky/redux-react-router';
import { backendApi } from './api/backendApi';
import { chroniclesApi } from './api/chronicles';
import createMultiLanguageRouterMiddleware from './middleware/multiLanguageRouterMiddleware';
import assets from './modules/assets';
import auth from './modules/auth';
import bookmarkFilter from './modules/bookmarkFilter';
import chronicles from './modules/chronicles';
import events from './modules/events';
import fetchImage from './modules/fetchImage';
import filters from './modules/filters';
import filtersAside from './modules/filtersAside';
import home from './modules/home';
import lessons from './modules/lessons';
import likutim from './modules/likutim';
import lists from './modules/lists';
import mdb from './modules/mdb';
import my from './modules/my';
import myNotes from './modules/myNotes';
import player from './modules/player';
import playlist from './modules/playlist';
import preparePage from './modules/preparePage';
import publications from './modules/publications';
import recommended from './modules/recommended';
import search from './modules/search';
import settings from './modules/settings';
import sources from './modules/sources';
import stats from './modules/stats';
import tags from './modules/tags';
import textPage from './modules/textPage';
import trim from './modules/trim';

const isProduction = process.env.NODE_ENV === 'production';
const verboseDebug = false;

const sagaMiddleware = createSagaMiddleware(
  verboseDebug ? { sagaMonitor: sagaMonitor(), logger: console.log } : {}
);

const setupMiddleware = history => getDefaultMiddleware => {
  const middleware = getDefaultMiddleware({
    serializableCheck : false,
    immutableCheck    : false,
    actionCreatorCheck: false
  }).concat(
    createMultiLanguageRouterMiddleware(history),
    backendApi.middleware,
    chroniclesApi.middleware,
    sagaMiddleware
  );
  // Conditionally add another middleware in dev
  if (verboseDebug) {
    middleware.push(logger);
  }

  return middleware;
};

const setupReducers = history => ({
  router                     : connectRouter(history),
  [backendApi.reducerPath]   : backendApi.reducer,
  [chroniclesApi.reducerPath]: chroniclesApi.reducer,

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
  recommended,
  chronicles,
  auth,
  my,
  myNotes,
  likutim,
  bookmarkFilter,
  trim,
  player,
  playlist,
  fetchImage,
  textPage
});

export function createStore(preloadedState, history) {
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
