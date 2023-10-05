import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Confirm, Button } from 'semantic-ui-react';
import { selectors as settings } from '../../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { useTranslation } from 'next-i18next';
import TagVideoLabelBtn from './TagVideoLabelBtn';
import { ADD_PLAYLIST_ITEM_MODES } from './SavePlaylistItemBtn';
import { actions as playerActions, playerSlice } from '../../../../../../lib/redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES } from '../../../../../helpers/consts';

const SaveAsLabel = ({ label, setModalMode }) => {
  const [confirm, setConfirm] = useState(false);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const dir                = getLanguageDirection(language);

  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const handleClose = () => {
    setModalMode(ADD_PLAYLIST_ITEM_MODES.none);
    setConfirm(false);
    dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <>
      <Confirm
        size="tiny"
        open={true}
        header={t('personal.addToPlaylistSuccessful', { name: '' })}
        onCancel={handleClose}
        onConfirm={handleClose}
        confirmButton={{ content: t('personal.label.ending') }}
        className="bookmark_confirm"
        cancelButton={<TagVideoLabelBtn label={label} onClose={handleClose} />}
        content={t('personal.label.contentCreate')}
        dir={dir}
      />
      <Modal
        open={confirm}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')} />

        <Button
          size="small"
          content={t('buttons.save')}
          color="blue"
          onClick={handleClose}
        />
      </Modal>
    </>
  );
};

export default SaveAsLabel;
