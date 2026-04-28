import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogPanel } from '@headlessui/react';

import NeedToLogin from '../../Sections/Personal/NeedToLogin';
import BookmarkForm from './BookmarkForm';
import { useSelector } from 'react-redux';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import AlertModal from '../AlertModal';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const BookmarkButton = ({ source, disabled }) => {
  const { t } = useTranslation();
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
      <AlertModal message={alertMsg} open={!!alertMsg} onClose={handleAlertClose} />
      <button
        className="px-2 py-1 small border rounded hover:bg-gray-100 inline-flex items-center"
        onClick={handleOpen}
        disabled={disabled}
      >
        <span className="material-symbols-outlined text-base">bookmark</span>
      </button>
      <Dialog open={!!open} onClose={handleClose} className="relative z-50" dir={dir}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className={`bg-white rounded-lg shadow-xl bookmark_modal ${!isMobileDevice ? 'max-w-sm w-full' : 'w-full h-full'}`}
          >
            <div className="px-6 py-4 border-b font-bold large">
              {t('personal.bookmark.saveBookmark')}
            </div>
            {
              !needToLogin ? <BookmarkForm onClose={handleClose} source={source} /> :
                <div className="p-6">{needToLogin}</div>
            }
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

BookmarkButton.propTypes = {
  source: PropTypes.object.isRequired
};

export default BookmarkButton;
