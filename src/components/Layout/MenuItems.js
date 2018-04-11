import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity';
import { Menu, Sidebar } from 'semantic-ui-react';
import NavLink from '../Language/MultiLanguageNavLink';

const ITEMS = [
  'lessons',
  'programs',
  'lectures',
  'sources',
  'events',
  // 'books',
  'topics',
  'publications',
  'project-status'
  // 'photos',
  // 'design',
  // 'design2',
];

const MenuItems = (props) => {
  const { simple, visible, t, onItemClick } = props;

  const items = ITEMS.map(x => (
    <Menu.Item
      key={x}
      as={NavLink}
      to={`/${x}`}
      className="sidebar-item"
      activeClassName="active"
      content={t(`nav.sidebar.${x}`)}
      onClick={onItemClick}
    />
  ));

  if (simple) {
    return (
      <Menu vertical borderless fluid color="blue" size="huge">
        {items}
      </Menu>
    );
  }

  return (
    <Sidebar pointing vertical as={Menu} animation="push" visible={visible}>
      {items}
    </Sidebar>
  );
};

MenuItems.propTypes = {
  simple: PropTypes.bool,
  visible: PropTypes.bool,
  t: PropTypes.func.isRequired,
  onItemClick: PropTypes.func
};

MenuItems.defaultProps = {
  simple: false,
  visible: false,
  onItemClick: identity
};

export default MenuItems;
