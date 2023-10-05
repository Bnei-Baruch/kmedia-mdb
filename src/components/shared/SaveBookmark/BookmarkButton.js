import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Modal, } from 'semantic-ui-react';

import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import BookmarkForm from './BookmarkForm';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import AlertModal from '../AlertModal';

const BookmarkButton = ({ t, source }) => {
  const [open, setOpen]         = useState();
  const [alertMsg, setAlertMsg] = useState();
  const needToLogin             = NeedToLogin({ t });

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(state => settings.getUIDir(state.settings));

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
          <Button
            compact
            size="small"
            icon="bookmark outline"
            onClick={handleOpen}
          />
        }
        open={open}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')} />
        {
          !needToLogin ? <BookmarkForm onClose={handleClose} source={source} /> :
            <Modal.Content content={needToLogin} />
        }
      </Modal>
    </>
  );
};

BookmarkButton.propTypes = {
  t: PropTypes.func.isRequired,
  source: PropTypes.object.isRequired,
};

export default withTranslation()(BookmarkButton);
