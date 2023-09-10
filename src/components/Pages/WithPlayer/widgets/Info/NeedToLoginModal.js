import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { selectors as settings } from '../../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';

const NeedToLoginModal = () => {
  const [open, setOpen] = useState(true);
  const language        = useSelector(state => settings.getLanguage(state.settings));
  const handleClose     = () => setOpen(false);
  const dir             = getLanguageDirection(language);
  return (
    <Modal
      closeIcon
      open={open}
      dir={dir}
      onClose={handleClose}
    >
      <Modal.Content>
        <NeedToLogin />
      </Modal.Content>
    </Modal>
  );
};

export default NeedToLoginModal;
