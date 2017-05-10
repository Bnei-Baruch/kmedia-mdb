import 'babel-polyfill';

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import LoadingBar, { loadingBarMiddleware } from 'react-redux-loading-bar';
import thunk from 'redux-thunk';

import 'semantic-ui-css/semantic.css';

// Automatic page load progress bar
// import '../../public/pace.min';
// import '../../public/pace.css';

import '../stylesheets/Kmedia.css';

import Layout from './layout';
import Footer from './footer';

import { AppRoutes } from './router';
import rootReducer from '../reducers';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const router = routerMiddleware(history);

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    rootReducer,
    router: routerReducer,
  }),
  applyMiddleware(
    router,
    loadingBarMiddleware(),
    thunk
  )
);

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

const Kmedia = () => (
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <Layout>
        <Switch>
          {
            AppRoutes.map(route =>
              <Route key={route.key} exact={route.exact} path={route.path} component={route.component} />)
          }
          <Route render={() => <h1>Page not found</h1>} />
        </Switch>
        <LoadingBar />
        <Footer />
      </Layout>
    </ConnectedRouter>
  </Provider>
);

export default Kmedia;
