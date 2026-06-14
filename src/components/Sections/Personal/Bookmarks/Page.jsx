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
    <div className={clsx('bookmark_page', { 'p-4': !isMobile })}
    >
      {isMobile && <BookmarkHeaderMobile />}
      <div className="flex flex-wrap gap-4">
        {!isMobile && <BookmarkHeader />}
        <div className="flex flex-1 gap-4">
          {!isMobile && <div className="w-full md:w-[350px] rounded p-4 shadow-lg"><FolderList /></div>}
          <div className="rounded p-4 shadow-lg flex-1">
            <BookmarkList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
