import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog } from '@headlessui/react';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import { settingsGetUIDirSelector } from '../../../../../redux/selectors';

const NeedToLoginModal = () => {
  const [open, setOpen] = useState(true);
  const uiDir           = useSelector(settingsGetUIDirSelector);
  const handleClose     = () => setOpen(false);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4" dir={uiDir}>
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
          <button
            className="absolute top-2 right-2"
            onClick={handleClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <NeedToLogin/>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NeedToLoginModal;
