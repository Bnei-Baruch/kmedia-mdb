import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions as filtersActions } from '../../../../redux/modules/bookmarkFilter';
import {
  MY_BOOKMARK_FILTER_FOLDER_ID,
  MY_BOOKMARK_FILTER_QUERY,
  MY_NAMESPACE_FOLDERS
} from '../../../../helpers/consts';
import { getMyItemKey } from '../../../../helpers/my';
import { bookmarkFilterGetByKeySelector, myGetItemByKeySelector } from '../../../../redux/selectors';

const BookmarkHeader = () => {
  const { t } = useTranslation();
  const query     = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));
  const folder_id = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder        = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query));

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;
  return (
    <div className="flex flex-wrap items-end">
      <div className="w-full md:w-1/4"/>
      <div className="w-full md:w-[31.25%]">
        <h2 className="my_header">
          <span className="material-symbols-outlined display-iblock">bookmark</span>
          {t('personal.bookmark.title')}
        </h2>
      </div>

      <div className="w-full md:w-[43.75%] text-right">
        <div className="relative bookmark_search inline-block">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            className="rounded border border-gray-300 py-2 pl-8 pr-3"
            placeholder={placeholder}
            defaultValue={query}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BookmarkHeader;
