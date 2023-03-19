import React, { useState } from 'react';
import { Button, Message, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withTranslation } from 'react-i18next';
import { POPOVER_CONFIRMATION_TIMEOUT } from './helper';

let timeout = null;

const clearTimeout = () => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
};

const ShareInputCopy = ({ url, t }) => {
  const [open, setOpen] = useState();

  const handleCopied = () => {
    clearTimeout();
    setOpen(true);
    timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  return (
    <div>
      <Message content={url} size="mini" />
      <Popup
        open={open}
        content={t('messages.link-copied-to-clipboard')}
        position="bottom right"
        trigger={(
          <CopyToClipboard text={url} onCopy={handleCopied}>
            <Button className="shareCopyLinkButton" size="mini" content={t('buttons.copy')} />
          </CopyToClipboard>
        )}
      />
    </div>
  );
};

export default withTranslation()(ShareInputCopy);
