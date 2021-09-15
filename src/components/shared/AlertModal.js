import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';

const AlertModal = ({ message, open, onClose }) => (
  <Modal
    closeIcon
    open={open}
    onClose={onClose}
    size={'mini'}
  >
    <Modal.Content>
      {message}
    </Modal.Content>
  </Modal>
);

AlertModal.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool,
};

export default AlertModal;
