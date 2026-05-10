import { clsx } from 'clsx';
import React, { useContext, useRef, useState } from 'react';

import { faBars, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useMatch } from 'react-router-dom';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { getEmbedFromQuery } from '../../helpers/player';
import Logo from '../../images/icons/Logo';
import { textPageGetIsFullscreenSelector } from '../../redux/selectors';
import KmediaRouters from '../../route/KmediaRouters';
import HandleLanguages from '../HandleLanguages/HandleLanguages';
import Icon from '../Icon';
import Link from '../Language/MultiLanguageLink';
import OmniBox from '../Search/OmniBox';
import DonationPopup from '../Sections/Home/DonationPopup';
import DownloadTrim from '../Share/DownloadTrim';
import { useClickOutside } from '../shared/useClickOutside';
import DonateNow, { VirtualHomeButton } from './DonateNow';
import Footer from './Footer';
import GAPageView from './GAPageView/GAPageView';
import HeadroomWraper from './HeadroomWraper';
import Login from './Login';
import MenuItems from './MenuItems';
import TopMost from './TopMost';

const Layout = ({ playerContainer }) => {
  const toggleSidebarBtnRef = useRef();
  const closeSidebarBtnRef  = useRef();
  const toggleSearchBtnRef  = useRef();
  const headerSearchRef     = useRef();
  const sidebarRef          = useRef();

  const { t, i18n }    = useTranslation();
  const location = useLocation();
  const isNotHome   = !useMatch('/:lang');

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const isFullscreen       = useSelector(textPageGetIsFullscreenSelector);

  const [sidebarActive, setSidebarActive] = useState(false);
  const [isShowSearch, setIsShowSearch]   = useState(isMobileDevice && location.pathname.endsWith('search'));

  const closeSidebar      = () => setSidebarActive(false);
  const openHeaderSearch  = () => setIsShowSearch(true);
  const closeHeaderSearch = () => setIsShowSearch(false);
  useClickOutside(closeSidebar, [sidebarRef, toggleSidebarBtnRef, closeSidebarBtnRef]);
  useClickOutside(closeHeaderSearch, [headerSearchRef, toggleSearchBtnRef]);

  const { embed } = getEmbedFromQuery(location);

  if (embed) {
    return (<KmediaRouters playerContainer={playerContainer} />);
  }

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const sideBarIcon = sidebarActive ? <Icon icon={faXmark} className="sidebar-icon" /> : <Icon icon={faBars} className="sidebar-icon" />;
  return (
    <div className={clsx('layout', { 'is_fullscreen': isFullscreen && isNotHome })}>
      <GAPageView location={location} />
      <div className="headroom-z-index-802">
        <HeadroomWraper>
          <div className="layout__header">
            <div className="layout__topbar">
              <div ref={toggleSidebarBtnRef}>
                <a
                  className="layout__sidebar-toggle"
                  onClick={toggleSidebar}
                >
                  {sideBarIcon}
                </a>
              </div>
              <Link className="logo" to="/">
                <Logo width="42px" height="80px" />
                <div className="logo__titles">
                  {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                    <div className="logo__subtitle">{i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}</div>
                  )}
                  <h1>{t('nav.top.header')}</h1>
                </div>
              </Link>
              <div className={isMobileDevice ? 'layout__search mobile-hidden' : 'layout__search layout__search_max_width'}>
                {isNotHome && <OmniBox />}
              </div>
              <div className="layout__header-buttons">
                <HandleLanguages />
                {
                  isNotHome && isMobileDevice &&
                  <div ref={toggleSearchBtnRef}>
                    <a className="layout__mobile-search-toggle text-white">
                      <Icon icon={faSearch} className="no-margin" onClick={openHeaderSearch} />
                    </a>
                  </div>
                }
                {
                  !isMobileDevice && (
                    <div>
                      <DonateNow />
                      <VirtualHomeButton />
                    </div>
                  )
                }
                <div>
                  <Login />
                </div>
                <TopMost />
              </div>
            </div>
          </div>
          {
            isShowSearch && (
              <div ref={headerSearchRef}>
                <div className="header_search">
                  <OmniBox />
                </div>
              </div>
            )
          }
        </HeadroomWraper>
      </div>
      <div
        ref={sidebarRef}
        className={clsx('layout__sidebar', { 'is-active': sidebarActive })}
      >
        <div className="layout__sidebar-header">
          <div ref={closeSidebarBtnRef}>
            <a
              className="layout__sidebar-toggle"
              onClick={closeSidebar}
            >
              {sideBarIcon}
            </a>
          </div>
          <Link className="logo mobile-hidden" to="/" onClick={closeSidebar}>
            <Logo width="2.5em" height="2.5em" />
            <div className="logo__titles">
              {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                <div className="logo__subtitle">{i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}</div>
              )}
              <h1>{t('nav.top.header')}</h1>
            </div>
          </Link>
        </div>
        <div className="layout__sidebar-menu">
          <MenuItems simple onItemClick={closeSidebar} />
        </div>
      </div>
      <div className="layout__main">
        <div className="layout__content">
          <DownloadTrim />
          <KmediaRouters playerContainer={playerContainer} />
        </div>
        <Footer />
      </div>
      <DonationPopup />
    </div>
  );
};

export default Layout;
