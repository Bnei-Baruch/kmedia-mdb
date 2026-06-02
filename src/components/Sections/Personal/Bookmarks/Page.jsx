import React, { useContext } from 'react';
import { clsx } from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarkList from './Bookmarks/List';
import NeedToLogin from '../NeedToLogin';
import FolderList from './Folders/List';
import BookmarkHeader from './Header';
import BookmarkHeaderMobile from './HeaderMobile';

const Page = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin();
  if (needToLogin) return needToLogin;

  return (
    <div className={clsx('bookmark_page', { 'p-4': !isMobileDevice })}
    >
      {isMobileDevice && <BookmarkHeaderMobile />}
      <div className="flex flex-wrap gap-4">
        {!isMobileDevice && <BookmarkHeader />}
        <div className="flex flex-1 gap-4">
          {!isMobileDevice && <div className="w-full md:w-[350px] border rounded p-4 shadow-lg"><FolderList /></div>}
          <div className="border rounded p-4 shadow-lg flex-1">
            <BookmarkList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
