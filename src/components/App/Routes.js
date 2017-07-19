import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../Layout/Layout';
import Design2 from '../Design/Design2';

const Routes = () => (
  <Switch>
    <Route exact path="/design2" component={Design2} />
    <Route component={Layout} />
  </Switch>
);

export default Routes;
