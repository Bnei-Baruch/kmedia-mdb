import React from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { getLanguageDirection } from '../../../../../helpers/i18n-utils';
import NeedToLogin from '../../../../Sections/Personal/NeedToLogin';

const NeedToLoginModal = () => {
  const language = useSelector(state => settings.getLanguage(state.settings));

  const dir = getLanguageDirection(language);
  return (
    <Modal
      closeIcon
      open={true}
      dir={dir}
    >
      <Modal.Content>
        <NeedToLogin />
      </Modal.Content>
    </Modal>
  );
};

export default NeedToLoginModal;
