import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Button, MenuItem, Modal, Popup} from 'semantic-ui-react';
import AlertModal from '../AlertModal';
import BookmarkForm from '../SaveBookmark/BookmarkForm';
import {useSelector} from 'react-redux';
import {getLanguageDirection} from '../../../helpers/i18n-utils';
import {DeviceInfoContext} from '../../../helpers/app-contexts';
import {selectors as settings} from '../../../redux/modules/settings';
import SelectTopicsModal from "../SelectTopicsModal/SelectTopicsModal";

const BookmarkBtn = ({t, source, close}) => {
  const [open, setOpen] = useState();
  const [alertMsg, setAlertMsg] = useState();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e, el, isCreated) => {
    isCreated && setAlertMsg(t('personal.bookmark.labelCreated'));
    setOpen(false);
    close();
  };

  const handleAlertClose = () => setAlertMsg(null);

  return (
    <>
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose}/>
      <SelectTopicsModal
        source={source}
        open={open}
        onClose={handleClose}
      />
      <Popup
        content={t('share-text.label-button-alt')}
        trigger={
          <MenuItem onClick={handleOpen}>
            <Button circular icon="sticky note"/>
            {t('share-text.note-button')}
          </MenuItem>
        }
      />
    </>

  );
};

BookmarkBtn.propTypes = {
  t: PropTypes.func.isRequired,
  query: PropTypes.object,
  source: PropTypes.object,
};

export default withNamespaces()(BookmarkBtn);
