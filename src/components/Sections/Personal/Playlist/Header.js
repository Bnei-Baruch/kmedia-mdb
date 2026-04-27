import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';

import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Link from '../../../Language/MultiLanguageLink';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../../../redux/selectors';

const PlaylistHeader = ({ confirmSuccess, save, playlist, t }) => {
  const [isEditName, setIsEditName] = useState();
  const [name, setName]             = useState();
  const [confirm, setConfirm]       = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const uiDir              = useSelector(settingsGetUIDirSelector);

  const handleChangeName = e => setName(e.target.value);

  const toggleEditName = () => {
    setName(playlist.name);
    setIsEditName(!isEditName);
  };

  const handleSave = () => {
    save(name);
    setIsEditName(false);
  };

  const remove = () => setConfirm(true);

  const handleConfirmCancel = () => setConfirm(false);

  const nameTag = isEditName ? (
    <>
      <input
        type="text"
        value={name}
        onChange={handleChangeName}
        maxLength={30}
        className="rounded border border-gray-300 px-3 py-2"
      />
      <button
        className="margin-right-8 margin-left-8 rounded bg-blue-500 px-4 py-2 text-white uppercase"
        onClick={handleSave}
      >
        {t('buttons.save')}
      </button>
      <button
        className="rounded border border-gray-300 px-4 py-2"
        onClick={toggleEditName}
      >
        {t('buttons.cancel')}
      </button>
    </>
  ) : playlist.name;

  return (
    <div className=" px-4  background_grey">
      <div className="summary-container align_items_center">
        <h2 className={`my_header ${isMobileDevice ? '' : ''}`}>
          <PlaylistPlayIcon className="playlist_icon"/>
          {nameTag}
          <span className="display-iblock margin-right-8 margin-left-8 small text-gray-500">
            {`${playlist.total_items} ${t('pages.collection.items.programs-collection')}`}
          </span>
        </h2>
        <div>
          <button className="clear_button border-none bg-transparent" onClick={toggleEditName}>
            <span className="material-symbols-outlined text-2xl">edit</span>
          </button>
          <Dialog open={!!confirm} onClose={handleConfirmCancel} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6" dir={uiDir}>
                <p>{t('personal.confirmRemovePlaylist', { name: playlist.name })}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="rounded border border-gray-300 px-4 py-2 small"
                    onClick={handleConfirmCancel}
                  >
                    {t('buttons.cancel')}
                  </button>
                  <button
                    className="rounded bg-blue-500 px-4 py-2 small text-white"
                    onClick={confirmSuccess}
                  >
                    {t('buttons.apply')}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
          <button className="clear_button border-none bg-transparent" onClick={remove}>
            <span className="material-symbols-outlined text-2xl">delete</span>
          </button>
        </div>
      </div>
      {
        (playlist.total_items > 0) && (<Link to={`/${MY_NAMESPACE_PLAYLISTS}/${playlist.id}`}>
          <button className="clear_button inline-flex items-center border-none bg-transparent">
            <span className="material-symbols-outlined text-3xl margin-left-8 margin-right-8">play_circle</span>
            {t('personal.playAll')}
          </button>
        </Link>)
      }
    </div>
  );
};

PlaylistHeader.propTypes = {
  playlist      : PropTypes.object.isRequired,
  confirmSuccess: PropTypes.func,
  save          : PropTypes.func
};

export default withTranslation()(PlaylistHeader);
