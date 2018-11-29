import { applyMiddleware, compose, createStore as reduxCreateStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
// import { createLogger } from 'redux-logger';

import sagaMonitor from '../sagas/helpers/sagaMonitor';
import createMultiLanguageRouterMiddleware from './middleware/multiLanguageRouterMiddleware';
// import createDeferredSagasMiddleware from './middleware/defferedSagasMiddleware';
import reducer from './index';
import { rootSaga } from '../sagas';

const isBrowser             = (typeof window !== 'undefined' && window.document);
const isProduction          = process.env.NODE_ENV === 'production';
const devToolsArePresent    = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined';
const devToolsStoreEnhancer = () => (isBrowser && devToolsArePresent ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f);

export default function createStore(initialState, history) {
  const middlewares = [
    // createDeferredSagasMiddleware(),
    createMultiLanguageRouterMiddleware(history)
  ];

  const sagaMiddlewareOptions = isProduction ? {} : { sagaMonitor: sagaMonitor(), logger: console.log };
  const sagaMiddleWare        = createSagaMiddleware(sagaMiddlewareOptions);
  middlewares.push(sagaMiddleWare);

  if (!isBrowser && !isProduction) {
    // const logger = createLogger({
    //   stateTransformer: () => {
    //   },
    //   actionTransformer: ({ type }) => ({ type }),
    //   colors: {
    //     title: () => false,
    //     prevState: () => false,
    //     action: () => false,
    //     nextState: () => false,
    //     error: () => false,
    //   }
    // });
    //
    // middlewares.push(logger);
  }

  const store = reduxCreateStore(reducer, initialState, compose(
    applyMiddleware(...middlewares),
    devToolsStoreEnhancer()
  ));

  // used server side
  store.rootSagaPromise = sagaMiddleWare.run(rootSaga).done;
  store.stopSagas      = () => store.dispatch(END);
  store.sagaMiddleWare = sagaMiddleWare;

  return store;
}
