import React from 'react';
import { Sidebar, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const MenuItems = ({ simple, visible, routes }) => {
  const menuItems = routes.map(item =>
    <Menu.Item as={NavLink} activeClassName="active violet" key={item.name} to={item.to}>{item.name}</Menu.Item>
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
  simple : React.PropTypes.bool,
  visible: React.PropTypes.bool,
  routes : React.PropTypes.arrayOf(React.PropTypes.shape({
    key      : React.PropTypes.string,
    exact    : React.PropTypes.bool,
    path     : React.PropTypes.string,
    component: React.PropTypes.object
  })).isRequired
};

MenuItems.defaultProps = {
  simple : false,
  visible: false
};

export default MenuItems;
