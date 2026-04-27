import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS, MY_NAMESPACE_FOLDERS } from '../../../helpers/consts';
import { getMyItemKey } from '../../../helpers/my';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import { myGetListSelector, myGetItemByKeySelector, textPageGetSubjectSelector } from '../../../redux/selectors';

const BookmarkForm = ({ onClose, bookmarkId, properties = {} }) => {
  const { t }                       = useTranslation();
  const [name, setName]             = useState();
  const [selected, setSelected]     = useState(null);
  const [editFolder, setEditFolder] = useState(false);
  const [query, setQuery]           = useState();
  const [isEdit, setIsEdit]         = useState();

  const subject  = useSelector(textPageGetSubjectSelector);
  const { key }  = getMyItemKey(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId });
  const bookmark = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_BOOKMARKS, key));
  const items    = useSelector(state => myGetListSelector(state, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));
  const saved    = items.filter(f => bookmark?.folder_ids?.includes(f.id)).map(f => f.id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (items.length === 0)
      dispatch(actions.fetch(MY_NAMESPACE_FOLDERS, { 'order_by': 'id DESC' }));
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (selected === null) {
      setSelected([...saved]);
    }
    //update selected only when saved was changed (that mean only on server response)
    //and not on changes of selected
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [saved?.length]);

  useEffect(() => {
    setName(bookmark?.name);
  }, [bookmark?.name]);

  if (!subject && !bookmark)
    return null;

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) {
    return (<div className="p-6">{needToLogin}</div>);
  }

  const changeName = (e, { value }) => setName(value);

  const handleSave = () => !bookmark ? create() : update();

  const create = () => {
    const params = {
      name,
      subject_uid: subject.id,
      subject_type: subject.type,
      properties: { ...subject.properties, ...properties }
    };

    if (selected.length > 0)
      params.folder_ids = selected;

    dispatch(actions.add(MY_NAMESPACE_BOOKMARKS, params));
    onClose();
  };

  const update = () => {
    dispatch(actions.edit(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId, name, folder_ids: selected }));
    onClose();
  };

  const handleChange = (checked, id) => {
    if (checked) {
      setSelected([id, ...selected || []]);
    } else {
      setSelected(selected.filter(x => x !== id));
    }
  };

  const handleNewFolder = () => {
    setEditFolder(true);
    handleSearchChange(null, { value: '' });
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSaveFolder(e);
    }
  };

  const handleSaveFolder = e => {
    dispatch(actions.add(MY_NAMESPACE_FOLDERS, { name: e.target.value || t('personal.bookmark.newFolder') }));
    setEditFolder(false);
  };

  const handleSearchChange = (e, { value }) => setQuery(value.toLowerCase());

  const renderFolder = f => (
    <li key={f.id}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selected?.includes(f.id)}
          onChange={e => handleChange(e.target.checked, f.id)}
        />
        {f.name}
      </label>
    </li>
  );

  return (
    <React.Fragment>
      <div className=" no-padding-top p-6 pt-0">
        <div>
          <h4 className="display-iblock font-normal inline-block">{t('personal.bookmark.name')}</h4>
          <input
            onChange={e => changeName(e, { value: e.target.value })}
            defaultValue={name}
            className={`bookmark_name border rounded px-3 py-2 ${!name && !isEdit ? 'border-red-500' : 'border-gray-300'}`}
            onFocus={() => setIsEdit(true)}
            onBlur={() => setIsEdit(false)}
            autoFocus
          />
        </div>
        <h4 className="font-normal">{t('personal.bookmark.folders')}</h4>
        <div className="border border-gray-200 rounded p-4">
          <div className="bookmark_search relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              placeholder={t('personal.bookmark.searchFolders')}
              onChange={e => handleSearchChange(e, { value: e.target.value })}
              className="pl-8 border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div className=" px-4 folders_list">
            {
              items.map(renderFolder)
            }
            {
              editFolder && (
                <>
                  <input
                    className="border border-gray-300 rounded px-3 py-2"
                    onBlur={handleSaveFolder}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onFocus={e => {
                      e.target.value = t('personal.bookmark.newFolder');
                      e.target.select();
                    }}
                  />
                  <button
                    className="no-shadow no-border border-none px-2 py-1"
                    onClick={handleSaveFolder}
                  >
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>
      {!editFolder &&
        <div className="flex justify-between p-4 border-t">
          <button
            className="border border-blue-500 text-blue-500 rounded px-4 py-2 hover:bg-blue-50"
            onClick={handleNewFolder}
            disabled={editFolder}
          >
            {t('personal.bookmark.newFolder')}
          </button>
          <div className="flex gap-2">
            <button
              className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600 margin-left-8 margin-right-8"
              onClick={onClose}
              disabled={editFolder}
            >
              {t('buttons.cancel')}
            </button>
            <button
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
              onClick={handleSave}
              disabled={!name || editFolder}
            >
              {t('buttons.save')}
            </button>
          </div>
        </div>
      }
    </React.Fragment>
  );
};

export default BookmarkForm;
