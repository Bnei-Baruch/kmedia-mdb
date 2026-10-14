import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../../../redux/modules/my';
import { MY_NAMESPACE_BOOKMARKS, MY_NAMESPACE_FOLDERS } from '../../../helpers/consts';
import { getMyItemKey } from '../../../helpers/my';
import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import { myGetListSelector, myGetItemByKeySelector, textPageGetSubjectSelector } from '../../../redux/selectors';
import BookmarkSearch from './BookmarkSearch';

// Semantic "ui tiny modal": 510px on desktop, 95% on small screens
export const BOOKMARK_MODAL_PANEL = 'bookmark_modal mx-auto w-[510px] max-w-[95%] max-h-[90%] overflow-y-auto rounded-[4px] bg-white shadow-[1px_3px_3px_0_rgba(0,0,0,.2),1px_3px_15px_2px_rgba(0,0,0,.2)]';
export const BOOKMARK_MODAL_TITLE = 'font-lato! text-[20px] font-bold leading-[1.28571429em] text-black/85 my-[10px] px-[21px] py-[17.5px]';

const BookmarkForm = ({ onClose, bookmarkId, properties = {} }) => {
  const { t } = useTranslation();
  const [name, setName] = useState();
  const [selected, setSelected] = useState(null);
  const [editFolder, setEditFolder] = useState(false);
  const [query, setQuery] = useState();
  const [isEdit, setIsEdit] = useState();

  const subject = useSelector(textPageGetSubjectSelector);
  const { key } = getMyItemKey(MY_NAMESPACE_BOOKMARKS, { id: bookmarkId });
  const bookmark = useSelector(state => myGetItemByKeySelector(state, MY_NAMESPACE_BOOKMARKS, key));
  const items = useSelector(state => myGetListSelector(state, MY_NAMESPACE_FOLDERS)).filter(x => !query || x.name.toLowerCase().includes(query));
  const saved = items.filter(f => bookmark?.folder_ids?.includes(f.id)).map(f => f.id);

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

  const needToLogin = NeedToLogin();
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
      setSelected([id, ...(selected || [])]);
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
    <div key={f.id}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selected?.includes(f.id)}
          onChange={e => handleChange(e.target.checked, f.id)}
        />
        {f.name}
      </label>
    </div>
  );

  return (
    <Fragment>
      <div className="px-[21px] pb-[21px]">
        <div className="flex items-center gap-[8px]">
          <h4 className="font-lato! text-[15px] font-normal my-[7.5px] whitespace-nowrap">{t('personal.bookmark.name')}</h4>
          <input
            onChange={e => changeName(e, { value: e.target.value })}
            defaultValue={name}
            className={`flex-1 rounded-[4px] border px-[16px] py-[4px] text-[16px] leading-[1.21428571em] text-black/80 focus:border-[#85b7d9] focus:outline-none ${!name && !isEdit ? 'border-red-500' : 'border-[rgba(34,36,38,.15)]'}`}
            onFocus={() => setIsEdit(true)}
            onBlur={() => setIsEdit(false)}
            autoFocus
          />
        </div>
        <h4 className="font-lato! text-[15px] font-normal my-[7.5px]">{t('personal.bookmark.folders')}</h4>
        <div className="rounded-[4px] border border-[rgba(34,36,38,.15)] p-[14px] shadow-[0_1px_2px_0_rgba(34,36,38,.15)]">
          <BookmarkSearch
            placeholder={t('personal.bookmark.searchFolders')}
            onChange={e => handleSearchChange(e, { value: e.target.value })}
          />
          <div className="folders_list mt-[14px]!">
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
        <div className="flex justify-between p-[14px]">
          <button
            className="rounded-[4px] px-[14px] py-[9.8px] leading-none text-[#2185d0] shadow-[inset_0_0_0_1px_#2185d0] hover:bg-[#2185d0]/5"
            onClick={handleNewFolder}
            disabled={editFolder}
          >
            {t('personal.bookmark.newFolder')}
          </button>
          <div className="flex gap-[8px]">
            <button
              className="rounded-[4px] bg-[#767676] px-[14px] py-[9.8px] font-bold leading-none text-white hover:bg-[#838383]"
              onClick={onClose}
              disabled={editFolder}
            >
              {t('buttons.cancel')}
            </button>
            <button
              className="rounded-[4px] bg-[#2185d0] px-[14px] py-[9.8px] font-bold leading-none text-white hover:bg-[#1678c2] disabled:opacity-45"
              onClick={handleSave}
              disabled={!name || editFolder}
            >
              {t('buttons.save')}
            </button>
          </div>
        </div>
      }
    </Fragment>
  );
};

export default BookmarkForm;
