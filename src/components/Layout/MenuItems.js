import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import identity from 'lodash/identity';
import { Button, Header, Menu, Sidebar } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import { getPodcastLinkByLangs, getRSSLinkByLangs } from '../../helpers/utils';
import NavLink from '../Language/MultiLanguageNavLink';
import DonateNow, { VirtualHomeButton } from './DonateNow';
import FeedBurner from './FeedBurner';
import { MY_NAMESPACE_BOOKMARKS } from '../../helpers/consts';
import useIsLoggedIn from '../shared/useIsLoggedIn';
import { login } from '../../pkg/ksAdapter/adapter';
import { settingsGetContentLanguagesSelector } from '../../redux/selectors';

const ITEMS = [
  'lessons',
  'programs',
  'sources',
  'likutim',
  'events',
  'topics',
  'publications',
  'music',
  'simple-mode',
  'sketches',
  'about',
  'help'
];

const MenuItems = ({ simple = false, visible = false, t, onItemClick = identity }) => {
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const loggedIn         = useIsLoggedIn();

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

  const personal = !loggedIn ? (
    <Menu.Item key={'personal'}>
      <Header as="h3" className="margin-bottom-4">
        <Header.Content content={t('nav.sidebar.personal')} className="weight-normal"/>
        <Header.Subheader content={t('personal.needToLogin')} className="margin-left-4 margin-right-4"/>
      </Header>
      <Button
        compact
        basic
        size="big"
        icon={'user circle outline'}
        content={t('personal.login')}
        className="donate-button margin-top-8"
        color={'blue'}
        as="a"
        target="_blank"
        onClick={login}
      />
    </Menu.Item>
  ) : (
    <Menu.Item
      key={'personal'}
      as={NavLink}
      to={'/personal'}
      className="sidebar-item"
      activeClassName="active"
      content={t('nav.sidebar.personal')}
      onClick={onItemClick}
    />
  );

  const bookmark = loggedIn ? (
    <Menu.Item
      key={MY_NAMESPACE_BOOKMARKS}
      as={NavLink}
      to={`/${MY_NAMESPACE_BOOKMARKS}`}
      className="sidebar-item"
      activeClassName="active"
      content={t(`nav.sidebar.${MY_NAMESPACE_BOOKMARKS}`)}
      onClick={onItemClick}
    />
  ) : null;

  if (simple) {
    return (
      <Menu vertical borderless fluid color="blue" size="huge">
        {personal}
        {bookmark}
        {items}
        <Menu.Item
          as="a"
          href="https://old.kabbalahmedia.info/"
          className="sidebar-item"
          content={t('nav.sidebar.old-site')}
        />
        <Menu.Item className="mobile-only">
          <DonateNow/>
          <VirtualHomeButton/>
        </Menu.Item>
        <Menu.Item
          key="rss"
          className="sidebar-item"
        >
          <Button
            icon="rss"
            size="mini"
            color="orange"
            href={getRSSLinkByLangs(contentLanguages)}/>
          <span className="margin-right-8 margin-left-8">RSS</span>
          <Button
            icon="apple"
            size="mini"
            className="margin-left-8"
            href={getPodcastLinkByLangs(contentLanguages)}/>
          <span className="margin-right-8 margin-left-8">{t('nav.sidebar.podcast')}</span>
        </Menu.Item>

        <Menu.Item
          key="feedBurner"
          className="sidebar-item"
        >
          <FeedBurner/>
        </Menu.Item>
      </Menu>
    );
  }

  return (
    <Sidebar pointing vertical as={Menu} animation="push" visible={visible}>
      {personal}
      {bookmark}
      {items}
    </Sidebar>
  );
};

MenuItems.propTypes = {
  simple     : PropTypes.bool,
  visible    : PropTypes.bool,
  t          : PropTypes.func.isRequired,
  onItemClick: PropTypes.func
};

MenuItems.defaultProps = {
  simple     : false,
  visible    : false,
  onItemClick: identity
};

export default withTranslation()(MenuItems);
