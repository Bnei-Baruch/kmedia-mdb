import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { useTranslation } from 'react-i18next';
import TagVideoLabelBtn from './TagVideoLabelBtn';
import { ADD_PLAYLIST_ITEM_MODES } from './SavePlaylistItemBtn';
import { actions as playerActions } from '../../../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../../../helpers/consts';
import { settingsGetUIDirSelector } from '../../../../../redux/selectors';

const SaveAsLabel = ({ label, setModalMode }) => {
  const [confirm, setConfirm] = useState(false);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const uiDir              = useSelector(settingsGetUIDirSelector);

  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const handleClose = () => {
    setModalMode(ADD_PLAYLIST_ITEM_MODES.none);
    setConfirm(false);
    dispatch(playerActions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4" dir={uiDir}>
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-sm w-full bookmark_confirm">
            <div className="p-4 border-b font-bold">
              {t('personal.addToPlaylistSuccessful', { name: '' })}
            </div>
            <div className="p-4">
              {t('personal.label.contentCreate')}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <TagVideoLabelBtn label={label} onClose={handleClose}/>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleClose}
              >
                {t('personal.label.ending')}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog
        open={confirm}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4" dir={uiDir}>
          <Dialog.Panel className={`bg-white rounded-lg shadow-xl ${!isMobileDevice ? 'max-w-sm' : 'max-w-full'} w-full bookmark_modal`}>
            <div className="p-4 border-b font-bold">
              {t('personal.bookmark.saveBookmark')}
            </div>
            <div className="p-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded small"
                onClick={handleClose}
              >
                {t('buttons.save')}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default SaveAsLabel;
