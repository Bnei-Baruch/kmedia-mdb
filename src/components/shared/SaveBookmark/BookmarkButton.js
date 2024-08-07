import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Modal } from 'semantic-ui-react';

import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import BookmarkForm from './BookmarkForm';
import { useSelector } from 'react-redux';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import AlertModal from '../AlertModal';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const BookmarkButton = ({ t, source, disabled }) => {
  const [open, setOpen]         = useState();
  const [alertMsg, setAlertMsg] = useState();
  const needToLogin             = NeedToLogin({ t });

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const dir                = useSelector(settingsGetUIDirSelector);

  const handleOpen  = () => setOpen(true);
  const handleClose = (e, el, isCreated) => {
    isCreated && setAlertMsg(t('personal.bookmark.bookmarkCreated'));
    setOpen(false);
  };

  const handleAlertClose = () => setAlertMsg(null);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose}/>
      <Modal
        trigger={
          <Button
            compact
            size="small"
            icon="bookmark outline"
            onClick={handleOpen}
            disabled={disabled}
          />
        }
        open={open}
        onClose={handleClose}
        size={!isMobileDevice ? 'tiny' : 'fullscreen'}
        dir={dir}
        className="bookmark_modal"
      >
        <Modal.Header content={t('personal.bookmark.saveBookmark')}/>
        {
          !needToLogin ? <BookmarkForm onClose={handleClose} source={source}/> :
            <Modal.Content content={needToLogin}/>
        }
      </Modal>
    </>
  );
};

BookmarkButton.propTypes = {
  t     : PropTypes.func.isRequired,
  source: PropTypes.object.isRequired
};

export default withTranslation()(BookmarkButton);
