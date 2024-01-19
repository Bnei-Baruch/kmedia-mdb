import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';
import { settingsGetUIDirSelector } from '../../../../../redux/selectors';

const NeedToLoginModal = () => {
  const [open, setOpen] = useState(true);
  const uiDir           = useSelector(settingsGetUIDirSelector);
  const handleClose     = () => setOpen(false);
  return (
    <Modal
      closeIcon
      open={open}
      dir={uiDir}
      onClose={handleClose}
    >
      <Modal.Content>
        <NeedToLogin/>
      </Modal.Content>
    </Modal>
  );
};

export default NeedToLoginModal;
