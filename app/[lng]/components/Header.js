'use client';
import React, { useContext, useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Icon, Menu, Segment, Header, Ref } from 'semantic-ui-react';
import Link from 'next/link';
import WrappedOmniBox from '/src/components/Search/OmniBox';
//import GAPageView from '/src/components/Layout/GAPageView/GAPageView';
//import MenuItems from '/src/components/Layout/MenuItems';
import { ClientChroniclesContext, DeviceInfoContext } from '/src/helpers/app-contexts';
import MenuItems from './MenuItems';
import { Logo } from '../../../src/images';
import Headroom from 'react-headroom';
import DonateNow, { VirtualHomeButton } from './DonateNow';
import HandleLanguages from './HandleLanguages';
//import Login from './Login';
import { useTranslation } from '../../i18n/client';

const WrappedOmniBoxWithChronicles = () => {
  const chronicles = useContext(ClientChroniclesContext);
  return <WrappedOmniBox chronicles={chronicles} />;
};

const RenderHeaderSearch = React.forwardRef(({ t }, headerSearchElement) => (
  <div ref={headerSearchElement}>
    <Segment color="blue" inverted className="header_search">
      <WrappedOmniBoxWithChronicles />
    </Segment>
  </div>
));

const MainLayout = ({ lng }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation(lng);
  const matches            = [];
  const searchParams       = {};

  const menuButtonElement1      = useRef();
  const menuButtonElement2      = useRef();
  const showSearchButtonElement = useRef();
  const headerSearchElement     = useRef();
  const sidebarElement          = useRef();

  const [sidebarActive, setSidebarActive]           = useState(false);
  const [isShowHeaderSearch, setIsShowHeaderSearch] = useState(isMobileDevice && searchParams?.search);
  useEffect(() => {
    const isCloseSideBar = e => {
      if (!sidebarActive || e.target === sidebarElement) {
        return false;
      }

      if (sidebarElement?.contains(e.target)) {
        return false;
      }

      if (menuButtonElement1.current?.contains(e.target)) {
        return false;
      }

      const hasTarget = menuButtonElement2.current && menuButtonElement2.current.contains(e.target);
      return !hasTarget;
    };

    const clickOutside = e => {
      if (isCloseSideBar(e)) {
        setSidebarActive(false);
      }
      const isCloseHeaderSearch = e => {
        if (!isShowHeaderSearch || e.target === headerSearchElement) {
          return false;
        }

        if (headerSearchElement.current?.contains(e.target)) {
          return false;
        }

        return showSearchButtonElement.current?.contains(e.target);
      };

      if (isCloseHeaderSearch(e)) {
        setIsShowHeaderSearch(!isShowHeaderSearch);
      }
    };

    document.addEventListener('click', clickOutside, true);

    return () => {
      document.removeEventListener('click', clickOutside, true);
    };
  }, [isShowHeaderSearch]);

  const sideBarIcon = sidebarActive ? <Icon size="large" name="x" /> : <Icon name="sidebar" />;
  const showSearch  = matches.length = 1;

  const closeSidebar = () => () => setSidebarActive(false);

  return (
    <>
      {/* <GAPageView />*/}
      <div className="headroom-z-index-802">
        <Headroom>
          <div className="layout__header">
            <Menu inverted borderless size="huge" color="blue">
              <div ref={menuButtonElement1}>
                <Menu.Item
                  icon
                  as="a"
                  className="layout__sidebar-toggle"
                  onClick={() => setSidebarActive(!sidebarActive)}
                >
                  {sideBarIcon}
                </Menu.Item>
              </div>
              <Menu.Item className="logo" header as={Link} href="/lessons">
                <Logo width="40" height="40" />
                <Header inverted as="h1" content={t('nav.top.header')} />
              </Menu.Item>
              <Menu.Item className={isMobileDevice ? 'layout__search mobile-hidden' : 'layout__search layout__search_max_width'}>
                {
                  showSearch && <WrappedOmniBoxWithChronicles />
                }
              </Menu.Item>
              <Menu.Menu position="right" className="layout__header-buttons">
                <Menu.Item className="no-margin">
                  <HandleLanguages />
                </Menu.Item>
                {
                  showSearch && isMobileDevice &&
                  <Ref innerRef={showSearchButtonElement}>
                    <Menu.Item as="a" position="right">
                      <Icon name="search" className="no-margin" onClick={() => setIsShowHeaderSearch(!isShowHeaderSearch)} />
                    </Menu.Item>
                  </Ref>
                }
                {
                  !isMobileDevice && (
                    <Menu.Item position="right">
                      {/*<DonateNow />*/}
                      {/*<VirtualHomeButton />*/}
                    </Menu.Item>
                  )
                }
                <Menu.Item position="right">
                  {/*<Login />*/}
                </Menu.Item>
                {/*<TopMost />*/}
              </Menu.Menu>
            </Menu>
          </div>
          {isShowHeaderSearch && <RenderHeaderSearch t={t} ref={headerSearchElement} />}
        </Headroom>
      </div>

      <div
        className={clsx('layout__sidebar', { 'is-active': sidebarActive })}
        ref={sidebarElement}
      >
        <Menu inverted size="huge" color="blue">
          <div ref={menuButtonElement2}>
            <Menu.Item
              icon
              as="a"
              className="layout__sidebar-toggle"
              onClick={closeSidebar}
            >
              {sideBarIcon}
            </Menu.Item>
          </div>
          <Menu.Item className="logo mobile-hidden" header as={Link} href="/" onClick={closeSidebar}>
            <Logo />
            <Header inverted as="h1" content={t('nav.top.header')} />
          </Menu.Item>
        </Menu>
        <div className="layout__sidebar-menu">
          <MenuItems simple onItemClick={closeSidebar} />
        </div>
      </div>
    </>
  );
};
export default MainLayout;
