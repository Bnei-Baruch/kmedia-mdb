import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, useTranslation } from 'next-i18next';
import { Button, Confirm, MenuItem, Modal, Popup } from 'semantic-ui-react';
import BookmarkForm from '../SaveBookmark/BookmarkForm';
import { useSelector } from 'react-redux';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import SelectTopicsModal from '../SelectTopicsModal/SelectTopicsModal';
import { selectors as textFile } from '../../../../lib/redux/slices/textFileSlice/textFileSlice';

const BookmarkBtn = ({ close }) => {
  const [open, setOpen]       = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [openTag, setOpenTag] = useState(false);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { t } = useTranslation();
  const dir   = useSelector(state => settings.getUIDir(state.settings));
  const label = useSelector(state => textFile.getLabelInfo(state.textFile));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e, el, isCreated) => {
    if (!isCreated || !label) {
      setOpen(false);
      close();
      return;
    }

    setConfirm(true);
    setOpen(false);
  };

  const handleConfirmCancel = () => {
    setConfirm(false);
    close();
  };

  const handleCloseTag = () => {
    setOpenTag(false);
    close();
  };

  return (
    <>
      <Confirm
        size="tiny"
        open={confirm}
        header={t('personal.bookmark.bookmarkCreated')}
        onCancel={handleConfirmCancel}
        onConfirm={() => setConfirm(false)}
        confirmButton={{ content: t('personal.label.ending') }}
        className="bookmark_confirm"
        cancelButton={
          <SelectTopicsModal
            label={label}
            open={openTag}
            onClose={handleCloseTag}
            trigger={
              <Button
                color="green"
                content={t('personal.label.tagging')}
                onClick={() => setOpenTag(true)}
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
                <Button circular icon="bookmark" />
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
        <Modal.Header content={t('personal.bookmark.saveBookmark')} />
        {<BookmarkForm onClose={handleClose} />}
      </Modal>
    </>
  );
};

BookmarkBtn.propTypes = {
  t: PropTypes.func.isRequired,
  query: PropTypes.object,
  source: PropTypes.object,
  label: PropTypes.object,
};

export default withTranslation()(BookmarkBtn);
