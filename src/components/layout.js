import React from 'react';
// import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';

import { Sidebar } from 'semantic-ui-react';

import TopFixedMenu from './topFixedMenu';
import MenuItems from './menu';
import MenuRoutes, { AppRoutes } from './router';
import Footer from './footer';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <div>
        <Sidebar.Pushable>
          <MenuItems active="daily_lessons" routes={MenuRoutes} visible={this.state.visible} />
          <Sidebar.Pusher>
            <TopFixedMenu title="Daily Lessons" toggleVisibility={this.toggleVisibility} />
            <div className="wrapper">
              <Switch>
                { AppRoutes.map(route => <Route {...route} />) }
                <Route render={() => <h1>Page not found</h1>} />
              </Switch>
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <LoadingBar />
        <Footer />
      </div>
    );
  }
}

Layout.propTypes = {};
