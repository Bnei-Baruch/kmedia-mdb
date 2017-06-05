import React from 'react';
import PropTypes from 'prop-types';

import { Menu as RMenu, Icon, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const TopFixedMenu = ({ title, toggleVisibility }) => (
  <RMenu fixed="top" inverted color="blue">
    <Container>
      <RMenu.Item as="a" icon className="ui padded grid tablet mobile only" onClick={toggleVisibility}>
        <Icon name="sidebar" style={{ padding: 0 }} />
      </RMenu.Item>
      <RMenu.Item header>
        <h3 className="main-title">
          Kabbalah Media
          <small>&nbsp;- {title}</small>
        </h3>
      </RMenu.Item>
      <RMenu.Item as={Link} to="/home"> Features </RMenu.Item>
      <RMenu.Item as={Link} to="/home"> Testimonials </RMenu.Item>
      <RMenu.Item as={Link} to="/home"> Sign-in </RMenu.Item>
    </Container>
  </RMenu>
);

TopFixedMenu.propTypes = {
  title           : PropTypes.string.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
};

export default TopFixedMenu;
