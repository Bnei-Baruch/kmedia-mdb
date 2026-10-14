import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../../../redux/modules/my';
import { MY_BOOKMARK_FILTER_FOLDER_ID, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { actions as filtersActions } from '../../../../../redux/modules/bookmarkFilter';
import FolderItem from './Item';
import BookmarkSearch from '../../../../shared/SaveBookmark/BookmarkSearch';
import { bookmarkFilterGetByKeySelector, myGetListSelector } from '../../../../../redux/selectors';

const FolderList = ({ close }) => {
  const { t } = useTranslation();
  const [editFolder, setEditFolder] = useState(false);
  const [query, setQuery] = useState();
  const [selectedMobile, setSelectedMobile] = useState();

  const { isMobile } = useContext(DeviceInfoContext);

  const items = useSelector(state => myGetListSelector(state, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));

  const dispatch = useDispatch();
  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [dispatch]);

  let selectedId = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));
  if (isMobile) selectedId = selectedMobile;

  const selectFolder = id => {
    if (isMobile)
      setSelectedMobile(id);
    else
      dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, id));
  };

  const handleClose = () => {
    dispatch(filtersActions.addFilter(MY_BOOKMARK_FILTER_FOLDER_ID, selectedMobile));
    close();
  };

  const newFolder = () => {
    setEditFolder(true);
    setQuery('');
  };

  const saveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value || t('personal.bookmark.newFolder') }));
    setEditFolder(false);
  };

  const searchChange = e => setQuery(e.target.value.toLowerCase());

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      saveFolder(e);
    }
  };

  const renderHeader = () => (
    <div className="flex w-full items-center border-b border-[#dcddde]">
      <div className="w-7/16">
        <h3 className="font-lato! text-[18px] -mt-[2.57px]">{t('personal.bookmark.folders')}</h3>
      </div>
      <div className="w-9/16">
        <BookmarkSearch
          className="w-full"
          placeholder={t('personal.bookmark.searchFolders')}
          onChange={searchChange}
          defaultValue={query}
        />
      </div>
    </div>
  );

  const renderEdit = () => {
    if (!editFolder) return null;

    return (
      <div className="flex flex-wrap" key={'newFolder'}>
        <div className="w-full">
          <input
            className="w-full rounded border border-gray-300 px-3 py-2"
            onBlur={saveFolder}
            onKeyDown={handleKeyDown}
            autoFocus
            onFocus={e => {
              e.target.value = t('personal.bookmark.newFolder');
              e.target.select();
            }}
          />
        </div>
      </div>
    );
  };

  const renderActions = () => (
    <>
      <button
        className="rounded-[4px] px-[21px] py-[11px] leading-none text-[#2185d0] shadow-[inset_0_0_0_1px_#2185d0] hover:bg-[#2185d0]/5"
        onClick={newFolder}
      >
        {t('personal.bookmark.newFolder')}
      </button>
      {
        isMobile && (
          <button
            className="float-right rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleClose}
          >
            {t('buttons.apply')}
          </button>
        )
      }
    </>
  );

  return (
    <>
      {renderHeader()}
      <div className="folders_list mt-[14px]!">
        <FolderItem
          folder={{ id: 'all', name: t('personal.bookmark.allFolders') }}
          key={'all'}
          selectedId={selectedId}
          selectFolder={selectFolder}
        />
        {renderEdit()}
        {
          items.map(f => (<FolderItem folder={f} key={f.id} selectedId={selectedId} selectFolder={selectFolder} />))
        }
      </div>
      <hr className="my-[14px] border-t border-[rgba(34,36,38,.15)]" />
      {renderActions()}
    </>
  );
};

export default FolderList;
