/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { Sidebar } from 'semantic-ui-react';

import TopFixedMenu from './topFixedMenu';
import MenuItems from './menu';
import MenuRoutes from './router';

export default class SidebarLeftPush extends React.Component {
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
            {this.props.children}
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

SidebarLeftPush.propTypes = {
  children: PropTypes.array.isRequired
};
