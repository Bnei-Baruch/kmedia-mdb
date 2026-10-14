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
import BookmarkSearch from '../../../shared/SaveBookmark/BookmarkSearch';

const BookmarkHeader = () => {
  const { t } = useTranslation();
  const query = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));
  const folder_id = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query));

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;
  return (
    <div className="flex w-full items-end py-[14px]">
      <div className="w-1/4" />
      <div className="w-5/16 px-[14px]">
        <h2 className="my_header justify-start! p-0! mb-[4px]! leading-[1.28571429em]">
          <span className="material-symbols-outlined">bookmark</span>
          {t('personal.bookmark.title')}
        </h2>
      </div>
      <div className="w-7/16 px-[14px] text-end">
        <BookmarkSearch className="w-[181px]" placeholder={placeholder} defaultValue={query} onChange={e => handleSearch(e.target.value)} />
      </div>
    </div>
  );
};

export default BookmarkHeader;
