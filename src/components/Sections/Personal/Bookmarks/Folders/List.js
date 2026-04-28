import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { clsx } from 'clsx';

import { actions } from '../../../../../redux/modules/my';
import { MY_BOOKMARK_FILTER_FOLDER_ID, MY_NAMESPACE_FOLDERS } from '../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { actions as filtersActions } from '../../../../../redux/modules/bookmarkFilter';
import FolderItem from './Item';
import { bookmarkFilterGetByKeySelector, myGetListSelector } from '../../../../../redux/selectors';

const FolderList = ({ close }) => {
  const { t } = useTranslation();
  const [editFolder, setEditFolder]         = useState(false);
  const [query, setQuery]                   = useState();
  const [selectedMobile, setSelectedMobile] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const items = useSelector(state => myGetListSelector(state, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));

  const dispatch = useDispatch();
  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [dispatch]);

  let selectedId = useSelector(state => bookmarkFilterGetByKeySelector(state, MY_BOOKMARK_FILTER_FOLDER_ID));
  if (isMobileDevice) selectedId = selectedMobile;

  const selectFolder = id => {
    if (isMobileDevice)
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
    <div className="flex items-center folders ">
      <div className="w-[43.75%]">
        <h3>{t('personal.bookmark.folders')}</h3>
      </div>
      <div className="w-[56.25%]">
        <div className="relative bookmark_search">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            className="w-full rounded border border-gray-300 py-2 pl-8 pr-3"
            placeholder={t('personal.bookmark.searchFolders')}
            onChange={searchChange}
            defaultValue={query}
          />
        </div>
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
        className="rounded border border-blue-500 px-4 py-2 text-blue-500"
        onClick={newFolder}
      >
        {t('personal.bookmark.newFolder')}
      </button>
      {
        isMobileDevice && (
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
    <div className="w-full md:w-1/4">
      <div className={clsx({ 'no-padding': isMobileDevice, 'border rounded p-4 shadow-sm': !isMobileDevice })}>
        {renderHeader()}
        <div className=" px-4 folders_list ">
          <div className="no-padding">
            <FolderItem
              folder={{ id: 'all', name: t('personal.bookmark.allFolders') }}
              key={'all'}
              selectedId={selectedId}
              selectFolder={selectFolder}
            />
            {renderEdit()}
            {
              items.map(f =>
                (
                  <FolderItem
                    folder={f}
                    key={f.id}
                    selectedId={selectedId}
                    selectFolder={selectFolder}
                  />
                )
              )
            }
          </div>
        </div>
        <hr className="my-4"/>
        {renderActions()}
      </div>
    </div>
  );
};

export default FolderList;
