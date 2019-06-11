import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import identity from 'lodash/identity';
import { Menu, Sidebar, Button } from 'semantic-ui-react';

import { getRSSLinkByLang } from '../../helpers/utils';
import NavLink from '../Language/MultiLanguageNavLink';
import DonateNow from './DonateNow';

const ITEMS = [
  'lessons',
  'programs',
  'sources',
  'events',
  // 'books',
  'topics',
  'publications',
  'simple-mode',
  // 'project-status',
  'help',
  // 'photos',
  // 'design',
  // 'design2',
];

const MenuItems = ({ simple, visible, t, onItemClick, language }) => {
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
        <Menu.Item
          as="a"
          href="https://old.kabbalahmedia.info/"
          className="sidebar-item"
          content={t('nav.sidebar.old-site')}
        />
        <Menu.Item className="mobile-only">
          <DonateNow language={language} />
        </Menu.Item>
        <Menu.Item
          key="rss"
          className="sidebar-item"
        >
          <Button
            icon="rss"
            size="mini"
            color="orange"
            bordered={false}
            fitted={false}
            href={getRSSLinkByLang(language)} />
          <span className="margin-right-8 margin-left-8">RSS</span>
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

export default withNamespaces()(MenuItems);
