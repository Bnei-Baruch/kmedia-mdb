import 'core-js/shim';
import 'regenerator-runtime/runtime';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware, { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import createHistory from 'history/createBrowserHistory';
import UAParser from 'ua-parser-js';

import createMultiLanguageRouterMiddleware from './redux/middleware/multiLanguageRouterMiddleware';
import reducer from './redux';
import { actions as system } from './redux/modules/system';
import allSagas from './sagas';
import sagaMonitor from './sagas/helpers/sagaMonitor';
import App from './components/App/App';

//
// Create redux store
//
const isProduction          = process.env.NODE_ENV === 'production';
const devToolsArePresent    = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined';
const devToolsStoreEnhancer = () => (!isProduction && devToolsArePresent ? window.devToolsExtension() : f => f);

const sagaMiddlewareOptions = isProduction ? {} : { sagaMonitor };
const sagaMiddleWare        = createSagaMiddleware(sagaMiddlewareOptions);

const history          = createHistory();
const routerMiddleware = createMultiLanguageRouterMiddleware(history);

ReactGA.initialize('UA-108372395-1');

const store = createStore(reducer, {}, compose(
  applyMiddleware(routerMiddleware, sagaMiddleWare),
  devToolsStoreEnhancer()
));

// Render regardless of application's state. let App decide what to render.
const appContainer = document.getElementById('root');
ReactDOM.render(<App store={store} history={history} />, appContainer);

//
// The main application
//
function* application() {
  //
  // Bootstrap the saga middleware with initial sagas
  //
  allSagas.forEach(saga => sagaMiddleWare.run(saga));

  //
  // Tell everybody, that we're booting now
  //
  yield put(system.boot());

  // Future: Do Whatever bootstrap logic here
  // Load configuration, load translations, etc...

  const deviceInfo = new UAParser().getResult();

  // determine if user gesture is required for play
  // if so we use native player else we use our beloved custom one.

  // default to us being on desktop or not
  let autoPlayAllowed = deviceInfo.device.type === undefined;

  try {
    yield call(() => {
      const v = document.createElement('video');
      v.src   = 'someting-meant-to-throw-NotSupportedError-when-play-is-allowed';
      return v.play();
    });
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      autoPlayAllowed = false;
    } else if (error.name === 'NotSupportedError') {
      autoPlayAllowed = true;
    }
  }

  // Future: Hydrate server state
  // Deep merges state fetched from server with the state saved in the local storage
  yield put(system.init({
    deviceInfo,
    autoPlayAllowed
  }));

  //
  // Just make sure that everybody does their initialization homework
  //
  yield delay(0);

  //
  // Inform everybody, that we're ready now
  //
  yield put(system.ready());
}

sagaMiddleWare.run(application);
