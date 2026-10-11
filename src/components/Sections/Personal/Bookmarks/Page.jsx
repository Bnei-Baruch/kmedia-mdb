import { useContext } from 'react';
import { clsx } from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarkList from './Bookmarks/List';
import NeedToLogin from '../NeedToLogin';
import FolderList from './Folders/List';
import BookmarkHeader from './Header';
import BookmarkHeaderMobile from './HeaderMobile';

const Page = () => {
  const { isMobile } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin();
  if (needToLogin) return needToLogin;

  return (
    <div className={clsx('bookmark_page', { 'p-[14px]': !isMobile })}>
      {isMobile && <BookmarkHeaderMobile />}
      <div className={clsx({ '-m-[14px]': !isMobile })}>
        {!isMobile && <BookmarkHeader />}
        <div className={clsx('flex items-start', isMobile ? 'pt-[14px]' : 'py-[14px]')}>
          {!isMobile && (
            <div className="w-1/4 px-[14px]">
              <div className="rounded-[4px] border border-[rgba(34,36,38,.15)] bg-white p-[14px] shadow-[0_0_8px_rgba(0,0,0,.15)]"><FolderList /></div>
            </div>
          )}
          <div className={clsx('flex-1', { 'px-[14px]': !isMobile })}>
            <div className={clsx('p-[14px] shadow-[0_0_8px_rgba(0,0,0,.15)]', { 'rounded-[4px] border border-[rgba(34,36,38,.15)] bg-white': !isMobile })}>
              <BookmarkList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
