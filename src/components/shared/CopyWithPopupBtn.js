import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Popup, } from 'semantic-ui-react';

import useStateWithCallback from '../../helpers/use-state-with-callback';
import { useTranslation } from 'react-i18next';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../helpers/consts';

const CopyWithPopupBtn = ({ text, children }) => {
  const { t }           = useTranslation();
  const [open, setOpen] = useStateWithCallback(false, open => {
    if (open) {
      timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  let timeout = undefined;

  const handleCopied = () => {
    clearPopupTimeout();
    setOpen(true);
  };

  const clearPopupTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return (
    <Popup
      open={open}
      content={t('messages.link-copied-to-clipboard')}
      position={`bottom left`}
      trigger={
        (
          <CopyToClipboard text={text} onCopy={handleCopied}>
            {children}
          </CopyToClipboard>)
      }
    />
  );
};

export default CopyWithPopupBtn;
