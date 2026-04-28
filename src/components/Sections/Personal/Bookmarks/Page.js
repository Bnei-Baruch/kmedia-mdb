import React, { useContext } from 'react';
import { clsx } from 'clsx';

import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import BookmarkList from './Bookmarks/List';
import NeedToLogin from '../NeedToLogin';
import { useTranslation } from 'react-i18next';
import FolderList from './Folders/List';
import BookmarkHeader from './Header';
import BookmarkHeaderMobile from './HeaderMobile';

const Page = () => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  return (
    <div className={clsx('w-full bookmark_page', {
      '': !isMobileDevice,
      'no-padding': isMobileDevice
    })}
    >
      {isMobileDevice && <BookmarkHeaderMobile/>}
      <div className={clsx('flex flex-wrap', { 'no-margin': isMobileDevice })}>
        {!isMobileDevice && <BookmarkHeader/>}
        <div className="flex flex-wrap w-full">
          {!isMobileDevice && <FolderList/>}
          <div
            className={clsx('w-full md:w-3/4', { 'no-margin no-padding': isMobileDevice })}
          >
            <div className={clsx({ 'border rounded p-4 shadow-sm': !isMobileDevice })}>
              <BookmarkList/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
