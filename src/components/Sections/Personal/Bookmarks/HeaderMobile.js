import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../helpers/consts';
import { actions as filtersActions } from '../../../../redux/modules/bookmarkFilter';
import { getMyItemKey } from '../../../../helpers/my';
import FolderList from './Folders/List';
import {
  bookmarkFilterGetByKeySelector,
  myGetItemByKeySelector,
  settingsGetUIDirSelector,
  settingsGetLeftRightByDirSelector
} from '../../../../redux/selectors';

const BookmarkHeaderMobile = ({ t }) => {
  const [open, setOpen] = useState();

  const folder_id = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));
  const query     = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder        = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query));

  const handleToggle = () => setOpen(!open);

  const removeFolderFilter = e => {
    dispatch(filtersActions.deleteFilter(MY_BOOKMARK_FILTER_FOLDER_ID));
    e.stopPropagation();
  };

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;

  const uiDir     = useSelector(settingsGetUIDirSelector);
  const leftRight = useSelector(settingsGetLeftRightByDirSelector);

  const trigger = (
    <div className=" px-4">
      <span
        className="inline-flex items-center cursor-pointer text-blue-500 large no-border padding_r_l_0"
        onClick={handleToggle}
      >
        <span className="material-symbols-outlined text-gray-400">folder_open</span>
        {t('personal.bookmark.folders')}
        <span className="material-symbols-outlined margin-left-8 margin-right-8">
          {leftRight === 'right' ? 'chevron_right' : 'chevron_left'}
        </span>
      </span>
      {
        folder && (
          <span className="inline-flex items-center large no-border">
            {folder.name}
            <button
              className="no-padding no-shadow inline-flex items-center border-none bg-transparent"
              onClick={removeFolderFilter}
            >
              <span className="material-symbols-outlined small text-gray-400 margin-left-8 margin-right-8">cancel</span>
            </button>
          </span>
        )
      }
    </div>
  );

  return (
    <div className=" px-4 ">
      <h2 className="my_header padding-top_1em">
        <span className="material-symbols-outlined display-iblock">bookmark</span>
        {t('personal.bookmark.title')}
      </h2>

      {trigger}
      <Dialog open={!!open} onClose={handleToggle} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative mx-auto w-full max-w-lg rounded bg-white p-6" dir={uiDir}>
            <button className="absolute top-2 right-2" onClick={handleToggle}>
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="no-padding">
              <div className="flex flex-wrap">
                <FolderList close={handleToggle}/>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="relative bookmark_search_mobile">
        <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input
          className="w-full rounded border border-gray-300 py-2 pl-8 pr-3"
          placeholder={placeholder}
          defaultValue={query}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default withTranslation()(BookmarkHeaderMobile);
