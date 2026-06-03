import { clsx } from 'clsx';
import React, { useContext, useRef, useState } from 'react';

import { faBars, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useMatch } from 'react-router-dom';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { getEmbedFromQuery } from '../../helpers/player';
import { Logo } from '../../images/icons';
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
  const sideBarIcon = sidebarActive
    ? <Icon icon={faXmark} className="text-[1.8rem] leading-none" />
    : <Icon icon={faBars} className="text-[1.8rem] leading-none" />;

  return (
    <div className={clsx('layout', { 'is_fullscreen': isFullscreen && isNotHome })}>
      <GAPageView location={location} />
      <div className="headroom-z-index-802">
        <HeadroomWraper>
          <div className="left-0 right-0 top-0 z-[2000]">
            <div className="h-20 flex items-center justify-between gap-4 max-md:gap-2 px-4 bg-brand-blue text-white">
              <div ref={toggleSidebarBtnRef} className={clsx({ '2xl:!hidden': !isFullscreen })}>
                <a
                  className="flex items-center justify-start text-white/80 font-bold cursor-pointer max-xl:h-20"
                  onClick={toggleSidebar}
                >
                  {sideBarIcon}
                </a>
              </div>
              <Link
                className="flex-initial min-w-0 xl:min-w-[300px] px-3 max-md:px-1 leading-4 gap-2 flex items-center text-white no-underline hover:text-white"
                to="/"
              >
                <Logo width="42px" height="80px" />
                <div className="flex flex-col leading-4 justify-center min-w-0 overflow-hidden">
                  {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
                    <div className="text-white text-[1.4rem] font-bold tracking-[0.02em] uppercase no-underline opacity-90 leading-none mb-[0.1rem] max-md:text-base whitespace-nowrap">
                      {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}
                    </div>
                  )}
                  <h1 className="text-white m-0 font-normal text-xl max-md:text-[.9rem] whitespace-nowrap">{t('nav.top.header')}</h1>
                </div>
              </Link>
              <div className={isMobileDevice ? 'flex-auto text-base p-4 max-md:hidden' : 'flex-auto text-base p-4 max-[480px]:max-w-[150px]'}>
                {isNotHome && <OmniBox />}
              </div>
              <div className="flex items-center flex-nowrap justify-between gap-4 shrink-0">
                <HandleLanguages />
                {
                  isNotHome && isMobileDevice &&
                  <div ref={toggleSearchBtnRef}>
                    <a className="flex items-center justify-center cursor-pointer text-white">
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
                <div className="!bg-brand-blue border-none shadow-none py-4 px-6 text-white">
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
              className="flex items-center justify-start text-white/80 font-bold cursor-pointer max-xl:h-20"
              onClick={closeSidebar}
            >
              {sideBarIcon}
            </a>
          </div>
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
