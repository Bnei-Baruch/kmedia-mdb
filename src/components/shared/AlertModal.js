import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

const AlertModal = ({ message, open, onClose }) => (
  <Modal
    closeIcon
    size={'mini'}
    open={open}
    onClose={onClose}
    content={message}
  />
);

AlertModal.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool,
};

export default AlertModal;
