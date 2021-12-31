import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Confirm, MenuItem, Modal, Popup } from 'semantic-ui-react';
import AlertModal from '../AlertModal';
import BookmarkForm from '../SaveBookmark/BookmarkForm';
import { useSelector } from 'react-redux';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { selectors as settings } from '../../../redux/modules/settings';
import SelectTopicsModal from '../SelectTopicsModal/SelectTopicsModal';

const BookmarkBtn = ({ t, source, close }) => {
  const [open, setOpen] = useState();
  const [confirm, setConfirm] = useState();
  const [openTag, setOpenTag] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir = getLanguageDirection(language);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e, el, isCreated) => {
    if (!isCreated) {
      setOpen(false);
      close();
      return
    }

    setConfirm(true);
    setOpen(false);
  };


  const handleConfirmCancel = () => {
    setConfirm(false)
    close()
  }

  const handleCloseTag = () => {
    setOpenTag(false)
    close()
  }

  return (
    <>
      <Confirm
        size="tiny"
        open={confirm}
        header={t('personal.label.headerCreate')}
        onCancel={handleConfirmCancel}
        onConfirm={() => setConfirm(false)}
        cancelButton={t('personal.label.ending')}
        confirmButton={
          <SelectTopicsModal
            source={source}
            open={openTag}
            onClose={handleCloseTag}
            trigger={
              <Button
                color="green"
                content={t('personal.label.tagging')}
              />
            }
          />
        }
        content={t('personal.label.contentCreate')}
        dir={dir}
      />
      <Modal
        trigger={
          <Popup
            content={t('share-text.bookmark-button-alt')}
            trigger={
              <MenuItem onClick={handleOpen}>
                <Button circular icon="bookmark"/>
                {t('share-text.bookmark-button')}
              </MenuItem>
            }
          />
        }
        open={open}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')}/>
        {<BookmarkForm onClose={handleClose} source={source}/>}
      </Modal>
    </>

  );
};

BookmarkBtn.propTypes = {
  t: PropTypes.func.isRequired,
  query: PropTypes.object,
  source: PropTypes.object,
};

export default withNamespaces()(BookmarkBtn);
