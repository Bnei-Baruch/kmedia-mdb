import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../redux/modules/settings';

const AlertModal = ({ message, open, onClose }) => {

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  return (
    <Modal
      closeIcon
      size={'mini'}
      open={open}
      onClose={onClose}
      content={message}
      dir={dir}
    />
  );
};

AlertModal.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool,
};

export default AlertModal;
