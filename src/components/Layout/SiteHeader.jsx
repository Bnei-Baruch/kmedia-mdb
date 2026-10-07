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
    ? <Icon icon={faXmark} className="text-2xl leading-none text-white/90" />
    : <Icon icon={faBars} className="text-2xl leading-none text-white/90" />;

  const content = (
    <>
      <div className="flex items-center justify-between gap-4 max-md:gap-2 px-[15px] bg-brand-blue text-white">
        <div ref={toggleSidebarBtnRef} className={clsx({ '2xl:!hidden': !isFullscreen })}>
          <a
            className="flex items-center justify-start cursor-pointer px-[15.5px]"
            onClick={toggleSidebar}
          >
            {sideBarIcon}
          </a>
        </div>
        <Link
          className="flex-initial min-w-0 min-[1490px]:min-w-[300px] ps-0 pe-3 -ms-4 max-md:pe-1 max-md:-ms-2 max-md:me-auto leading-4 gap-2.5 flex items-center text-white no-underline hover:text-white"
          to="/"
        >
          <Logo width="43px" height="120px" viewBox="50 0 330 600" className="-my-5 shrink-0" />
          <div className="flex flex-col leading-4 justify-center min-w-0 overflow-hidden">
            {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle') && (
              <div className="font-lato text-white opacity-90 uppercase no-underline leading-none mb-[1.4px] whitespace-nowrap text-[21px] font-[1000] tracking-[0.02em] max-[1199px]:text-[16.8px] rtl:text-[28px] rtl:font-black rtl:tracking-[-0.04em] rtl:max-[1199px]:text-[19.6px]">
                {i18n.getResource(i18n.language, 'common', 'nav.top.subtitle')}
              </div>
            )}
            <h1 className="font-lato! text-white m-0 leading-[1.28571429em] whitespace-nowrap text-[17.5px] font-medium mt-[1.4px] max-[1199px]:text-[14px] rtl:text-[18.2px] rtl:font-thin rtl:-mt-[3px] rtl:max-[1199px]:text-[14px]">{t('nav.top.header')}</h1>
          </div>
        </Link>
        <div className={isMobile ? 'flex-auto text-base p-4 max-md:hidden' : 'flex-auto text-base p-4 max-[480px]:max-w-[150px]'}>
          {isNotHome && <OmniBox />}
        </div>
        <div className={clsx('flex items-center flex-nowrap justify-between shrink-0 text-white/90', isMobile ? 'gap-4' : 'gap-6')}>
          <HandleLanguages />
          {
            isNotHome && isMobile &&
            <div ref={toggleSearchBtnRef} className='flex items-center'>
              <a className="flex items-center justify-center cursor-pointer text-white">
                <Icon icon={faSearch} className="no-margin" onClick={openHeaderSearch} />
              </a>
            </div>
          }
          {
            !isMobile && (
              <div className="flex items-center gap-1.5">
                <DonateNow />
                <VirtualHomeButton />
              </div>
            )
          }
          <div className={clsx({ 'ms-1.5 pe-3': !isMobile })}>
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
