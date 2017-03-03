import React from 'react';
import { Menu, Icon, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TopFixedMenu = ({ title, toggleVisibility }) => (
  <Menu fixed="top">
    <Menu.Item as="a" icon className="ui padded grid tablet mobile only" onClick={toggleVisibility}>
      <Icon name="sidebar" style={{ padding: 0 }}/>
    </Menu.Item>
    <Menu.Item header>
      <Header as="h4" className="main-title" style={{ marginBottom: 0 }}>Kabbalah Media</Header>
      <small>&nbsp;- {title}</small>
    </Menu.Item>
    <Menu.Item as={Link} to="/home"> Features </Menu.Item>
    <Menu.Item as={Link} to="/home"> Testimonials </Menu.Item>
    <Menu.Item as={Link} to="/home"> Sign-in </Menu.Item>
  </Menu>
);

export default TopFixedMenu;

