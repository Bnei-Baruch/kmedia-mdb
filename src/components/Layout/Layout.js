import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';

import { Grid, Sidebar } from 'semantic-ui-react';

import TopFixedMenu from './TopFixedMenu';
import MenuItems from './MenuItems';
import MenuRoutes, { AppRoutes } from './router';
import Footer from './Footer';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <Sidebar.Pushable>
        <MenuItems active="daily_lessons" routes={MenuRoutes} visible={this.state.visible} />
        <Sidebar.Pusher>
          <TopFixedMenu title="Daily Lessons" toggleVisibility={this.toggleVisibility} />
          <div className="wrapper">
            <Grid columns="equal" className="main-content container">
              <Grid.Row>
                <Grid.Column width={3} only="computer" className="main-menu">
                  <MenuItems simple routes={MenuRoutes} />
                </Grid.Column>
                <Grid.Column>
                  <Grid padded>
                    <Grid.Row>
                      <Switch>
                        { AppRoutes.map(route => <Route {...route} />) }
                        <Route render={() => <h1>Page not found</h1>} />
                      </Switch>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <LoadingBar />
            <Footer />
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

Layout.propTypes = {};
