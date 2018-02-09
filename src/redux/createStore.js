import { applyMiddleware, compose, createStore as reduxCreateStore } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';

import sagaMonitor from '../sagas/helpers/sagaMonitor';
import createMultiLanguageRouterMiddleware from './middleware/multiLanguageRouterMiddleware';
// import createDeferredSagasMiddleware from './middleware/defferedSagasMiddleware';
import reducer from './index';
import { rootSaga } from '../sagas';

export default function createStore(initialState, history) {
  const isBrowser             = (typeof window !== 'undefined' && window.document);
  const isProduction          = process.env.NODE_ENV === 'production';
  const devToolsArePresent    = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
  const devToolsStoreEnhancer = () => (isBrowser && devToolsArePresent ? window.devToolsExtension() : f => f);

  const middlewares = [
    // createDeferredSagasMiddleware(),
    createMultiLanguageRouterMiddleware(history)
  ];

  const sagaMiddlewareOptions = isProduction ? {} : { sagaMonitor };
  const sagaMiddleWare        = createSagaMiddleware(sagaMiddlewareOptions);
  middlewares.push(sagaMiddleWare);

  const store = reduxCreateStore(reducer, initialState, compose(
    applyMiddleware(...middlewares),
    devToolsStoreEnhancer()
  ));

  sagaMiddleWare.run(rootSaga);

  store.stopSagas      = () => store.dispatch(END);
  store.sagaMiddleWare = sagaMiddleWare;

  return store;
}
