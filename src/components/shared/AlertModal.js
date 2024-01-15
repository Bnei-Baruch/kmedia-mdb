import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../redux/selectors';

const AlertModal = ({ message, open, onClose }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);
  return (
    <Modal
      closeIcon
      size={'mini'}
      open={open}
      onClose={onClose}
      content={message}
      dir={uiDir}
    />
  );
};

AlertModal.propTypes = {
  message: PropTypes.string,
  open   : PropTypes.bool
};

export default AlertModal;
