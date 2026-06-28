import { clsx } from 'clsx';
import { useRef, useState } from 'react';

import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { useLocation, useMatch } from 'react-router-dom';
import { getEmbedFromQuery } from '../../helpers/player';
import { textPageGetIsFullscreenSelector } from '../../redux/selectors';
import KmediaRouters from '../../route/KmediaRouters';
import DonationPopup from '../Sections/Home/DonationPopup';
import DownloadTrim from '../Share/DownloadTrim';
import { useClickOutside } from '../shared/useClickOutside';
import Footer from './Footer';
import GAPageView from './GAPageView/GAPageView';
import Icon from '../Icon';
import MenuItems from './MenuItems';
import SiteHeader from './SiteHeader';

const Layout = ({ playerContainer }) => {
  const toggleSidebarBtnRef = useRef();
  const closeSidebarBtnRef  = useRef();
  const sidebarRef          = useRef();

  const location     = useLocation();
  const isNotHome    = !useMatch('/:lang');
  const isFullscreen = useSelector(textPageGetIsFullscreenSelector);

  const [sidebarActive, setSidebarActive] = useState(false);

  const closeSidebar = () => setSidebarActive(false);
  useClickOutside(closeSidebar, [sidebarRef, toggleSidebarBtnRef, closeSidebarBtnRef]);

  const { embed } = getEmbedFromQuery(location);

  if (embed) {
    return (<KmediaRouters playerContainer={playerContainer} />);
  }

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const sideBarIcon = sidebarActive
    ? <Icon icon={faXmark} className="text-2xl font-bold leading-none text-white" />
    : <Icon icon={faBars} className="text-2xl font-bold leading-none text-white" />;

  return (
    <div className={clsx('layout', { 'is_fullscreen': isFullscreen && isNotHome })}>
      <GAPageView location={location} />
      <div className="headroom-z-index-802 print:hidden">
        <SiteHeader
          toggleSidebarBtnRef={toggleSidebarBtnRef}
          toggleSidebar={toggleSidebar}
          sidebarActive={sidebarActive}
        />
      </div>
      <div
        ref={sidebarRef}
        className={clsx('layout__sidebar', { 'is-active': sidebarActive })}
      >
        <div className="layout__sidebar-header">
          <div ref={closeSidebarBtnRef}>
            <a
              className="flex items-center justify-start cursor-pointer max-xl:h-20"
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
