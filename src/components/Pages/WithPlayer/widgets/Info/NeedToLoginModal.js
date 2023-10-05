import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { selectors as settings } from '../../../../../redux/modules/settings';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';

const NeedToLoginModal = () => {
  const [open, setOpen] = useState(true);
  const uiDir           = useSelector(state => settings.getUIDir(state.settings));
  const handleClose     = () => setOpen(false);
  return (
    <Modal
      closeIcon
      open={open}
      dir={uiDir}
      onClose={handleClose}
    >
      <Modal.Content>
        <NeedToLogin />
      </Modal.Content>
    </Modal>
  );
};

export default NeedToLoginModal;
