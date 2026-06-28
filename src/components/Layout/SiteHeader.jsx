import { clsx } from 'clsx';
import { useContext, useRef, useState, useSyncExternalStore } from 'react';
import Headroom from 'react-headroom';

import { faBars, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useMatch } from 'react-router-dom';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { Logo } from '../../images/icons';
import { textPageGetIsFullscreenSelector } from '../../redux/selectors';
import HandleLanguages from '../HandleLanguages/HandleLanguages';
import Icon from '../Icon';
import Link from '../Language/MultiLanguageLink';
import OmniBox from '../Search/OmniBox';
import { useClickOutside } from '../shared/useClickOutside';
import DonateNow, { VirtualHomeButton } from './DonateNow';
import Login from './Login';
import TopMost from './TopMost';

const SiteHeader = ({ toggleSidebarBtnRef, toggleSidebar, sidebarActive }) => {
  const toggleSearchBtnRef = useRef();
  const headerSearchRef    = useRef();

  const { t, i18n }    = useTranslation();
  const location       = useLocation();
  const isNotHome      = !useMatch('/:lang');
  const { isMobile } = useContext(DeviceInfoContext);
  const isFullscreen   = useSelector(textPageGetIsFullscreenSelector);

  const [isShowSearch, setIsShowSearch] = useState(isMobile && location.pathname.endsWith('search'));

  const openHeaderSearch  = () => setIsShowSearch(true);
  const closeHeaderSearch = () => setIsShowSearch(false);
  useClickOutside(closeHeaderSearch, [headerSearchRef, toggleSearchBtnRef]);

  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  const sideBarIcon = sidebarActive
    ? <Icon icon={faXmark} className="text-2xl font-bold leading-none text-white" />
    : <Icon icon={faBars} className="text-2xl font-bold leading-none text-white" />;

  const content = (
    <>
      <div className="flex items-center justify-between gap-4 max-md:gap-2 px-4 bg-brand-blue text-white">
        <div ref={toggleSidebarBtnRef} className={clsx({ '2xl:!hidden': !isFullscreen })}>
          <a
            className="flex items-center justify-start font-bold cursor-pointer"
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
        <div className={isMobile ? 'flex-auto text-base p-4 max-md:hidden' : 'flex-auto text-base p-4 max-[480px]:max-w-[150px]'}>
          {isNotHome && <OmniBox />}
        </div>
        <div className="flex items-center flex-nowrap justify-between gap-4 shrink-0">
          <HandleLanguages />
          {
            isNotHome && isMobile &&
            <div ref={toggleSearchBtnRef}>
              <a className="flex items-center justify-center cursor-pointer text-white">
                <Icon icon={faSearch} className="no-margin" onClick={openHeaderSearch} />
              </a>
            </div>
          }
          {
            !isMobile && (
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
      {
        isShowSearch && (
          <div ref={headerSearchRef}>
            <div className="!bg-brand-blue border-none shadow-none py-4 px-6 text-white">
              <OmniBox />
            </div>
          </div>
        )
      }
    </>
  );

  if (!isClient) {
    return <div>{content}</div>;
  }

  return (
    <Headroom>
      {content}
    </Headroom>
  );
};

export default SiteHeader;
