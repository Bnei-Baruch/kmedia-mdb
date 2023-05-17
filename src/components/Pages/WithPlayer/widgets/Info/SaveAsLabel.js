import React, { useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Confirm, Button } from 'semantic-ui-react';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { useTranslation } from 'react-i18next';
import TagVideoLabelBtn from './TagVideoLabelBtn';
import { ADD_PLAYLIST_ITEM_MODES } from './SavePlaylistItemBtn';

const updateStatus = { save: 1, delete: 2 };

const SaveAsLabel = ({ label, setModalMode }) => {
  const [confirm, setConfirm] = useState(false);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const dir                = getLanguageDirection(language);

  const { t } = useTranslation();

  const handleClose = () => {
    setModalMode(ADD_PLAYLIST_ITEM_MODES.none);
    setConfirm(false);
  };

  return (
    <>
      <Confirm
        size="tiny"
        open={true}
        header={t('personal.playlist.playlistItemCreated')}
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
