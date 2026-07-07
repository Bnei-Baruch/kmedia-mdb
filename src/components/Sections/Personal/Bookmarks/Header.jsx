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
  const query = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_QUERY));
  const folder_id = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));

  const { key: fKey } = getMyItemKey(MY_NAMESPACE_FOLDERS, { id: folder_id });
  const folder = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_FOLDERS, fKey));

  const dispatch = useDispatch();

  const handleSearch = query => dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_QUERY, query));

  const placeholder = !folder ? t('personal.bookmark.searchBookmarks') : `${t('personal.bookmark.filterByFolder')}: ${folder.name}`;
  return (
    <div className="flex w-full items-center gap-2 justify-between px-4 py-2 ms-[350px]">
      <h2 className="my_header !w-auto">
        <span className="material-symbols-outlined">bookmark</span>
        {t('personal.bookmark.title')}
      </h2>

      <div>
        <div className="bookmark_search flex items-center gap-2 border-b border-gray-300">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input
            className="border-0 bg-transparent py-2 pe-3 focus:outline-none"
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
