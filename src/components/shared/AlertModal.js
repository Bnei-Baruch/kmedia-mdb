import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../redux/selectors';

const AlertModal = ({ message, open, onClose }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);
  return (
    <Dialog open={!!open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-xl" dir={uiDir}>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <p>{message}</p>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

AlertModal.propTypes = {
  message: PropTypes.string,
  open   : PropTypes.bool
};

export default AlertModal;
