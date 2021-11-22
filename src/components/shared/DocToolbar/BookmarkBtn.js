import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Icon, MenuItem, Modal } from 'semantic-ui-react';
import AlertModal from '../AlertModal';
import BookmarkForm from '../SaveBookmark/BookmarkForm';
import { useSelector } from 'react-redux';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { selectors as settings } from '../../../redux/modules/settings';

const BookmarkBtn = ({ t, source }) => {
  const [open, setOpen]         = useState();
  const [alertMsg, setAlertMsg] = useState();

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const dir                = getLanguageDirection(language);

  const handleOpen  = () => setOpen(true);
  const handleClose = (e, el, isCreated) => {
    isCreated && setAlertMsg(t('personal.bookmark.bookmarkCreated'));
    setOpen(false);
  };

  const handleAlertClose = () => setAlertMsg(null);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose} />
      <Modal
        trigger={
          <MenuItem onClick={handleOpen}>
            <Button circular icon="bookmark" />
            bookmark
          </MenuItem>
        }
        open={open}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')} />
        {<BookmarkForm onClose={handleClose} source={source} />}
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
