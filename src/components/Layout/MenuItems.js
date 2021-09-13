import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import identity from 'lodash/identity';
import { Button, Container, Menu, MenuItem, Sidebar } from 'semantic-ui-react';

import { getPodcastLinkByLang, getRSSLinkByLang } from '../../helpers/utils';
import NavLink from '../Language/MultiLanguageNavLink';
import DonateNow, { VirtualHomeButton } from './DonateNow';
import FeedBurner from './FeedBurner';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../redux/modules/auth';

const ITEMS = [
  'lessons',
  'programs',
  'sources',
  'events',
  // 'books',
  'topics',
  'publications',
  // 'music',
  'simple-mode',
  // 'project-status',
  'help',
  // 'photos',
  // 'design',
  // 'design2',
];

const MenuItems = ({ simple = false, visible = false, t, onItemClick = identity, language }) => {
  const user     = useSelector(state => selectors.getUser(state.auth));
  const dispatch = useDispatch();
  const login    = () => dispatch(actions.login(language));

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

  const personal = !user ? (
    <Menu.Item
      key={'personal'}
      className="sidebar-item"
    >
      <h3 className="weight-normal margin-bottom-4">{t('nav.sidebar.personal')}</h3>
      <Container content={t('personal.needToLogin')} />
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

  if (simple) {
    return (
      <Menu vertical borderless fluid color="blue" size="huge">
        {personal}
        {items}
        <Menu.Item
          as="a"
          href="https://old.kabbalahmedia.info/"
          className="sidebar-item"
          content={t('nav.sidebar.old-site')}
        />
        <Menu.Item className="mobile-only">
          <DonateNow language={language} />
          <VirtualHomeButton />
        </Menu.Item>
        <Menu.Item
          key="rss"
          className="sidebar-item"
        >
          <Button
            icon="rss"
            size="mini"
            color="orange"
            href={getRSSLinkByLang(language)} />
          <span className="margin-right-8 margin-left-8">RSS</span>
          <Button
            icon="apple"
            size="mini"
            className="margin-left-8"
            href={getPodcastLinkByLang(language)} />
          <span className="margin-right-8 margin-left-8">{t('nav.sidebar.podcast')}</span>
        </Menu.Item>

        <Menu.Item
          key="feedBurner"
          className="sidebar-item"
        >
          <FeedBurner language={language} />
        </Menu.Item>
      </Menu>
    );
  }

  return (
    <Sidebar pointing vertical as={Menu} animation="push" visible={visible}>
      {personal}
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
