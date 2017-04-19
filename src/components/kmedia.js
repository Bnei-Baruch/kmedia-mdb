import 'babel-polyfill';

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.css';

import '../../public/pace.min';
import '../../public/pace.css';

import '../stylesheets/Kmedia.css';

import Layout from './layout';
import Footer from './footer';

import { AppRoutes } from './router';

const Kmedia = () => (
  <Layout>
    <Switch>
      {
        AppRoutes.map(route =>
          <Route key={route.key} exact={route.exact} path={route.path} component={route.component} />)
      }
      <Route render={() => <h1>Page not found</h1>} />
    </Switch>
    <Footer />
  </Layout>
);

export default Kmedia;
