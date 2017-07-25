import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';

const ITEMS = [
  'lessons',
  'tv_shows',
  'lectures',
  'sources',
  'events',
  'books',
  'topics',
  'publications',
  'photos',
  'design',
];

const MenuItems = (props) => {
  const { simple, visible, t } = props;

  const items = ITEMS.map(x => (
    <Menu.Item
      key={x}
      as={NavLink}
      to={`/${x}`}
      activeClassName="active"
      content={t(`nav.sidebar.${x}`)}
    />
  ));

  if (simple) {
    return (
      <Menu vertical fluid pointing color="blue">
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
};

MenuItems.defaultProps = {
  simple: false,
  visible: false,
};

export default translate()(MenuItems);
