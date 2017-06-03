import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Sidebar } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const MenuItems = ({ simple, visible, routes }) => {
  const menuItems = routes.map(item =>
    <Menu.Item as={NavLink} activeClassName="active blue" key={item.name} to={item.to}>{item.name}</Menu.Item>
  );
  if (simple) {
    return (
      <Menu vertical fluid pointing>{menuItems}</Menu>
    );
  }

  return (
    <Sidebar as={Menu} animation="push" visible={visible} pointing vertical>
      {menuItems}
    </Sidebar>
  );
};

MenuItems.propTypes = {
  simple: PropTypes.bool,
  visible: PropTypes.bool,
  routes: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    exact: PropTypes.bool,
    path: PropTypes.string,
    component: PropTypes.object
  })).isRequired
};

MenuItems.defaultProps = {
  simple: false,
  visible: false
};

export default MenuItems;
