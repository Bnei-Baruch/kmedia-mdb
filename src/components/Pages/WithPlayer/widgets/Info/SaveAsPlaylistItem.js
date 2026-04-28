import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';

import { actions } from '../../../../../redux/modules/my';
import { actions as playerActions } from '../../../../../redux/modules/player';
import { MY_NAMESPACE_PLAYLIST_EDIT, MY_NAMESPACE_PLAYLISTS, PLAYER_OVER_MODES } from '../../../../../helpers/consts';
import { useTranslation } from 'react-i18next';
import AddPlaylistForm from './AddPlaylistForm';
import { ADD_PLAYLIST_ITEM_MODES } from './SavePlaylistItemBtn';
import {
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  myGetListSelector,
  settingsGetUIDirSelector
} from '../../../../../redux/selectors';

const SaveAsPlaylistItem = ({ setModalMode, label }) => {
  const [selected, setSelected] = useState([]);
  const [isNew, setIsNew]       = useState(false);

  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const { cuId }  = useSelector(playlistGetInfoSelector);
  const unit      = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId));
  const playlists = useSelector(state => myGetListSelector(state, MY_NAMESPACE_PLAYLIST_EDIT));
  const uiDir     = useSelector(settingsGetUIDirSelector);

  const [name, setName] = useState(unit.name);

  useEffect(() => {
    dispatch(actions.fetch(MY_NAMESPACE_PLAYLIST_EDIT, { 'exist_cu': cuId, order_by: 'id DESC' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (checked, p) => {
    if (checked) {
      setSelected([p, ...selected]);
    } else {
      setSelected(selected.filter(x => x.id !== p.id));
    }
  };

  const toggleNewPlaylist = () => setIsNew(!isNew);

  const handleCancel = () => {
    setIsNew(false);
    setModalMode(ADD_PLAYLIST_ITEM_MODES.none);
    dispatch(playerActions.setOverMode(PLAYER_OVER_MODES.none));
  };

  const handleSave = () => {
    const { properties } = label;

    selected.forEach(p => dispatch(actions.add(MY_NAMESPACE_PLAYLISTS, {
      id         : p.id,
      items      : [{ position: -1, content_unit_uid: cuId, name, properties }],
      changeItems: true
    })));

    setIsNew(false);
    setModalMode(ADD_PLAYLIST_ITEM_MODES.label);
  };

  const handleNameChange = e => setName(e.target.value);

  const renderPlaylist = p => (
    <li key={p.id} className="flex items-center gap-2 py-1">
      <input
        type="checkbox"
        checked={selected.some(x => x.id === p.id)}
        onChange={e => handleChange(e.target.checked, p)}
      />
      <span>{p.name}</span>
    </li>
  );

  return (
    <>
      <Dialog
        open={true}
        onClose={handleCancel}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4" dir={uiDir}>
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-sm w-full relative">
            <button
              className="absolute top-2 right-2"
              onClick={handleCancel}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="p-4 border-b font-bold">{t('personal.addToPlaylist')}</div>
            <div className="p-4">
              <input
                className="w-full border rounded px-2 py-1 small autocomplete"
                placeholder={t('buttons.name')}
                onChange={handleNameChange}
                value={name}
              />
              <ul className="list-none p-0 mt-2">
                {playlists.map(renderPlaylist)}
                {(playlists.length === 0) && t(`personal.no_${MY_NAMESPACE_PLAYLISTS}`)}
                <div className="my-4" />
                {
                  (isNew || playlists.length === 0) ? (
                    <AddPlaylistForm close={toggleNewPlaylist}/>
                  ) : (
                    <li key="add_playlist" className="flex items-center gap-2 py-1 cursor-pointer" onClick={toggleNewPlaylist}>
                      <span className="material-symbols-outlined">add</span>
                      <span>{t('personal.newPlaylist')}</span>
                    </li>
                  )
                }
              </ul>
            </div>
            {
              !isNew && (
                <div className="flex justify-end gap-2 p-4 border-t">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded uppercase"
                    onClick={handleSave}
                    disabled={!selected.length}
                  >
                    {t('buttons.save')}
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={handleCancel}
                  >
                    {t('buttons.cancel')}
                  </button>
                </div>
              )
            }
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default SaveAsPlaylistItem;
