import { routerReducer, routerMiddleware /* , push */ } from 'react-router-redux';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import thunk from 'redux-thunk';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import root from '../reducers/rootReducer';

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export default function configureStore(history) {
  return createStore(
    combineReducers({
      root,
      router: routerReducer,
    }),
    composeWithDevTools(applyMiddleware(
      routerMiddleware(history), // the middleware for intercepting and dispatching navigation actions
      loadingBarMiddleware(),
      thunk
    ))
  );
}
