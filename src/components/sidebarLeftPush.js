import React from 'react';
import { Sidebar, Segment, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import TopFixedMenu from './TopFixedMenu';

class SidebarLeftPush extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar as={Menu} animation="push" visible={this.state.visible} pointing vertical>
          <Menu.Item as={Link} to="/home" active color="violet"> Daily Lessons </Menu.Item>
          <Menu.Item as={Link} to="/home"> TV & Video Programs </Menu.Item>
          <Menu.Item as={Link} to="/home"> Lectures & Lessons </Menu.Item>
          <Menu.Item as={Link} to="/home"> Sources </Menu.Item>
          <Menu.Item as={Link} to="/home"> Events </Menu.Item>
          <Menu.Item as={Link} to="/home"> Books </Menu.Item>
          <Menu.Item as={Link} to="/home"> Topics </Menu.Item>
          <Menu.Item as={Link} to="/home"> Publications </Menu.Item>
          <Menu.Item as={Link} to="/home"> Photos </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <TopFixedMenu title="Daily Lessons" toggleVisibility={this.toggleVisibility}/>
          <div className="pusher">
            {this.props.children}
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default SidebarLeftPush;
