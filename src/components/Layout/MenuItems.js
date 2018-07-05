import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity';
import { Menu, Sidebar } from 'semantic-ui-react';

import NavLink from '../Language/MultiLanguageNavLink';
import DonateNow from './DonateNow';
import { LANG_HEBREW } from '../../helpers/consts';

const ITEMS = [
  'lessons',
  'programs',
  'sources',
  'events',
  // 'books',
  'topics',
  'publications',
  'project-status',
  'twitter',
  // 'help',
  // 'photos',
  // 'design',
  // 'design2',
];

const MenuItems = (props) => {
  const { simple, visible, t, onItemClick, language } = props;

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
        {
          language === LANG_HEBREW ?
            <Menu.Item
              as={NavLink}
              to="/help"
              className="sidebar-item"
              activeClassName="active"
              content={t('nav.sidebar.help')}
              onClick={onItemClick}
            /> :
            null
        }
        <Menu.Item
          as="a"
          href="https://old.kabbalahmedia.info/"
          className="sidebar-item"
          content={t('nav.sidebar.old-site')}
        />
        <Menu.Item className="mobile-only">
          <DonateNow t={t} language={language} />
        </Menu.Item>
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
  onItemClick: PropTypes.func,
  language: PropTypes.string.isRequired,
};

MenuItems.defaultProps = {
  simple: false,
  visible: false,
  onItemClick: identity
};

export default MenuItems;
