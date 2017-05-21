import 'babel-polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import 'semantic-ui-css/semantic.css';

// Automatic page load progress bar
// import '../../public/pace.min';
// import '../../public/pace.css';

import configureStore from '../store/configureStore';
import '../stylesheets/Kmedia.css';

import Layout from './layout';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = configureStore(history);

const Kmedia = () => (
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <Layout />
    </ConnectedRouter>
  </Provider>
);

export default Kmedia;
