import React from 'react';
import { clsx } from 'clsx';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import identity from 'lodash/identity';
import { useSelector } from 'react-redux';
import { faUser, faRss, faAppleWhole } from '@fortawesome/free-solid-svg-icons';

import { getPodcastLinkByLangs, getRSSLinkByLangs } from '../../helpers/utils';
import NavLink from '../Language/MultiLanguageNavLink';
import Icon from '../Icon';
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
    <NavLink
      key={x}
      to={`/${x}`}
      className="sidebar-nav__link"
      activeClassName="active"
      onClick={onItemClick}
    >
      {t(`nav.sidebar.${x}`)}
    </NavLink>
  ));

  const personal = !loggedIn ? (
    <div key="personal" className="sidebar-nav__personal">
      <h3 className="sidebar-nav__title">
        {t('nav.sidebar.personal')}
        <span className="sidebar-nav__subtitle">{t('personal.needToLogin')}</span>
      </h3>
      <a
        className="sidebar-nav__login"
        onClick={login}
        target="_blank"
        rel="noreferrer"
      >
        <Icon icon={faUser} />
        {t('personal.login')}
      </a>
    </div>
  ) : (
    <NavLink
      key="personal"
      to="/personal"
      className="sidebar-nav__link"
      activeClassName="active"
      onClick={onItemClick}
    >
      {t('nav.sidebar.personal')}
    </NavLink>
  );

  const bookmark = loggedIn ? (
    <NavLink
      key={MY_NAMESPACE_BOOKMARKS}
      to={`/${MY_NAMESPACE_BOOKMARKS}`}
      className="sidebar-nav__link"
      activeClassName="active"
      onClick={onItemClick}
    >
      {t(`nav.sidebar.${MY_NAMESPACE_BOOKMARKS}`)}
    </NavLink>
  ) : null;

  if (simple) {
    return (
      <nav className="sidebar-nav">
        {personal}
        {bookmark}
        {items}
        <a
          href="https://old.kabbalahmedia.info/"
          className="sidebar-nav__link"
        >
          {t('nav.sidebar.old-site')}
        </a>
        <div className="sidebar-nav__donate">
          <DonateNow />
          <VirtualHomeButton />
        </div>
        <div className="sidebar-nav__rss">
          <a
            className="sidebar-nav__rss-btn sidebar-nav__rss-btn--orange"
            href={getRSSLinkByLangs(contentLanguages)}
          >
            <Icon icon={faRss} />
          </a>
          <span className="sidebar-nav__rss-label">RSS</span>
          <a
            className="sidebar-nav__rss-btn sidebar-nav__rss-btn--grey"
            href={getPodcastLinkByLangs(contentLanguages)}
          >
            <Icon icon={faAppleWhole} />
          </a>
          <span className="sidebar-nav__rss-label">{t('nav.sidebar.podcast')}</span>
        </div>
        <div className="sidebar-nav__feed">
          <FeedBurner />
        </div>
      </nav>
    );
  }

  return (
    <aside className={clsx('sidebar-nav sidebar-nav--aside', { 'is-hidden': !visible })}>
      {personal}
      {bookmark}
      {items}
    </aside>
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
