import logger from 'redux-logger';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware, { END } from 'redux-saga';

import { rootSaga } from '../sagas';
import sagaMonitor from '../sagas/helpers/sagaMonitor';

import createMultiLanguageRouterMiddleware from './middleware/multiLanguageRouterMiddleware';
import { createRouterReducer as connectRouter } from '@lagunovsky/redux-react-router';
import settings from './modules/settings';
import preparePage from './modules/preparePage';
import events from './modules/events';
import lessons from './modules/lessons';
import publications from './modules/publications';
import filters from './modules/filters';
import filtersAside from './modules/filtersAside';
import lists from './modules/lists';
import sources from './modules/sources';
import tags from './modules/tags';
import mdb from './modules/mdb';
import search from './modules/search';
import assets from './modules/assets';
import home from './modules/home';
import stats from './modules/stats';
import simpleMode from './modules/simpleMode';
import recommended from './modules/recommended';
import chronicles from './modules/chronicles';
import music from './modules/music';
import auth from './modules/auth';
import my from './modules/my';
import myNotes from './modules/myNotes';
import likutim from './modules/likutim';
import bookmarkFilter from './modules/bookmarkFilter';
import trim from './modules/trim';
import player from './modules/player';
import playlist from './modules/playlist';
import fetchImage from './modules/fetchImage';
import textPage from './modules/textPage';

const isProduction = process.env.NODE_ENV === 'production';

const sagaMiddleware = createSagaMiddleware(
  // isProduction ? {} : { sagaMonitor: sagaMonitor(), logger: console.log }
  {}
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
  /*if (!isProduction) {
    middleware.push(logger);
  }*/

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
  myNotes,
  likutim,
  bookmarkFilter,
  trim,
  player,
  playlist,
  fetchImage,
  textPage
});

export default function createStore(preloadedState, history) {
  console.log('configureStore, apply middleware');
  const store = configureStore({
    preloadedState,
    reducer   : setupReducers(history),
    middleware: setupMiddleware(history),
    // Turn off devtools in prod, or pass options in dev
    devTools: false, // !isProduction
  });

  // used server side
  store.rootSagaPromise = sagaMiddleware.run(rootSaga).done;
  store.stopSagas       = () => store.dispatch(END);
  store.sagaMiddleWare  = sagaMiddleware;

  return store;
}
