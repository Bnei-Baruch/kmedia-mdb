import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Confirm, Button } from 'semantic-ui-react';
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
      <Confirm
        size="tiny"
        open={true}
        header={t('personal.addToPlaylistSuccessful', { name: '' })}
        onCancel={handleClose}
        onConfirm={handleClose}
        confirmButton={{ content: t('personal.label.ending') }}
        className="bookmark_confirm"
        cancelButton={<TagVideoLabelBtn label={label} onClose={handleClose}/>}
        content={t('personal.label.contentCreate')}
        dir={uiDir}
      />
      <Modal
        open={confirm}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={uiDir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')}/>

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
