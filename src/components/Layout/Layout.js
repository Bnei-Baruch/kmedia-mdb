import clsx from 'clsx';
import React, { useContext, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useMatch } from 'react-router-dom';
import { Header, Icon, Menu, Ref, Segment } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { getEmbedFromQuery } from '../../helpers/player';
import Logo from '../../images/icons/Logo';
import { textPageGetIsFullscreenSelector } from '../../redux/selectors';
import KmediaRouters from '../../route/KmediaRouters';
import HandleLanguages from '../HandleLanguages/HandleLanguages';
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
  const sideBarIcon   = sidebarActive ? <Icon size="large" name="x" /> : <Icon name="sidebar" />;

  return (
    <div className={clsx('layout', { 'is_fullscreen': isFullscreen && isNotHome })}>
      <GAPageView location={location} />
      <div className="headroom-z-index-802">
        <HeadroomWraper>
          <div className="layout__header">
            <Menu inverted borderless size="huge" color="blue">
              <div ref={toggleSidebarBtnRef}>
                <Menu.Item
                  icon
                  as="a"
                  className="layout__sidebar-toggle"
                  onClick={toggleSidebar}
                >
                  {sideBarIcon}
                </Menu.Item>
              </div>
              <Menu.Item className="logo" header as={Link} to="/">
                <Logo width="120px" height="120px" />
                <div className="logo__titles">
                  {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                    <div className="logo__subtitle">{i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}</div>
                  )}
                  <Header inverted as="h1" content={t('nav.top.header')} />
                </div>
              </Menu.Item>
              <Menu.Item className={isMobileDevice ? 'layout__search mobile-hidden' : 'layout__search layout__search_max_width'}>
                {isNotHome && <OmniBox />}
              </Menu.Item>
              <Menu.Menu position="right" className="layout__header-buttons">
                <Menu.Item className="no-margin">
                  <HandleLanguages />
                </Menu.Item>
                {
                  isNotHome && isMobileDevice &&
                  <Ref innerRef={toggleSearchBtnRef}>
                    <Menu.Item as="a" position="right">
                      <Icon name="search" className="no-margin" onClick={openHeaderSearch} />
                    </Menu.Item>
                  </Ref>
                }
                {
                  !isMobileDevice && (
                    <Menu.Item position="right">
                      <DonateNow />
                      <VirtualHomeButton />
                    </Menu.Item>
                  )
                }
                <Menu.Item position="right">
                  <Login />
                </Menu.Item>
                <TopMost />
              </Menu.Menu>
            </Menu>
          </div>
          {
            isShowSearch && (
              <div ref={headerSearchRef}>
                <Segment color="blue" inverted className="header_search">
                  <OmniBox />
                </Segment>
              </div>
            )
          }
        </HeadroomWraper>
      </div>
      <div
        ref={sidebarRef}
        className={clsx('layout__sidebar', { 'is-active': sidebarActive })}
      >
        <Menu inverted size="huge" color="blue">
          <div ref={closeSidebarBtnRef}>
            <Menu.Item
              icon
              as="a"
              className="layout__sidebar-toggle"
              onClick={closeSidebar}
            >
              {sideBarIcon}
            </Menu.Item>
          </div>
          <Menu.Item className="logo mobile-hidden" header as={Link} to="/" onClick={closeSidebar}>
            <Logo width="120px" height="120px" />
            <div className="logo__titles">
              {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                <div className="logo__subtitle">{i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}</div>
              )}
              <Header inverted as="h1" content={t('nav.top.header')} />
            </div>
          </Menu.Item>
        </Menu>
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
