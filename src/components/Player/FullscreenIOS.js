import React, { useRef, useState, useLayoutEffect } from 'react';
import { Modal } from 'semantic-ui-react';

const FullscreenIOS = ({ children }) => {

  return (
    <Modal
      open={true}
      size="fullscreen"
      basic
      className="is-IOS-fullscreen"
    >
      <div className="rotate-player">
        {children}
      </div>
    </Modal>
  );

};

export default FullscreenIOS;
