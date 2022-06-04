import { applyMiddleware, compose, createStore as reduxCreateStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import sagaMonitor from '../sagas/helpers/sagaMonitor';
import createMultiLanguageRouterMiddleware from './middleware/multiLanguageRouterMiddleware';
import config from '../helpers/config';
import reducer from './index';
import { rootSaga } from '../sagas';

const devToolsArePresent    = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined';
const devToolsStoreEnhancer = () => (config.isBrowser() && devToolsArePresent ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);

export default function createStore(initialState, history) {
  const middlewares = [
    createMultiLanguageRouterMiddleware(history)
  ];

  const sagaMiddlewareOptions = config.isProductionBuild() ? {} : { sagaMonitor: sagaMonitor(), logger: console.log };
  const sagaMiddleWare        = createSagaMiddleware(sagaMiddlewareOptions);
  middlewares.push(sagaMiddleWare);

  const store = reduxCreateStore(reducer(history), initialState, compose(
    applyMiddleware(...middlewares),
    devToolsStoreEnhancer()
  ));

  // used server side
  store.rootSagaPromise = sagaMiddleWare.run(rootSaga).done;
  store.stopSagas      = () => store.dispatch(END);
  store.sagaMiddleWare = sagaMiddleWare;

  return store;
}
