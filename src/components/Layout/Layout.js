import clsx from 'clsx';
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
            <div className="layout__topbar flex items-center text-white ">
              <div ref={toggleSidebarBtnRef}>
                <a
                  className="layout__sidebar-toggle p-4 cursor-pointer large"
                  onClick={toggleSidebar}
                >
                  {sideBarIcon}
                </a>
              </div>
              <Link className="logo flex items-center no-underline" to="/">
                <Logo width="42px" height="80px" />
                <div className="logo__titles">
                  {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                    <div className="logo__subtitle">{i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}</div>
                  )}
                  <h1 className="text-white m-0 font-normal text-2xl">{t('nav.top.header')}</h1>
                </div>
              </Link>
              <div className={isMobileDevice ? 'layout__search mobile-hidden p-4 flex-1' : 'layout__search layout__search_max_width p-4 flex-1'}>
                {isNotHome && <OmniBox />}
              </div>
              <div className="layout__header-buttons flex items-center ml-auto">
                <div className="no-margin">
                  <HandleLanguages />
                </div>
                {
                  isNotHome && isMobileDevice &&
                  <div ref={toggleSearchBtnRef}>
                    <a className="flex items-center justify-center p-4 cursor-pointer ml-auto">
                      <Icon icon={faSearch} className="no-margin" onClick={openHeaderSearch} />
                    </a>
                  </div>
                }
                {
                  !isMobileDevice && (
                    <div className="flex items-center p-4 ml-auto">
                      <DonateNow />
                      <VirtualHomeButton />
                    </div>
                  )
                }
                <div className="flex items-center p-4 ml-auto">
                  <Login />
                </div>
                <TopMost />
              </div>
            </div>
          </div>
          {
            isShowSearch && (
              <div ref={headerSearchRef}>
                <div className="header_search bg-[#2185d0] text-white p-4">
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
        <div className="layout__sidebar-header flex flex-col">
          <div ref={closeSidebarBtnRef}>
            <a
              className="layout__sidebar-toggle flex items-center p-4 cursor-pointer"
              onClick={closeSidebar}
            >
              {sideBarIcon}
            </a>
          </div>
          <Link className="logo mobile-hidden flex items-center p-4 text-white hover:text-white" to="/" onClick={closeSidebar}>
            <Logo width="2.5em" height="2.5em" />
            <div className="logo__titles ml-4">
              {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                <div className="logo__subtitle">{i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}</div>
              )}
              <h1 className="text-white m-0 text-2xl font-normal">{t('nav.top.header')}</h1>
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
