import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { POPOVER_CONFIRMATION_TIMEOUT } from '../../helpers/consts';

const getEmbed = url => {
  const appendChar = url.indexOf('?') !== -1 ? '&' : '?';
  return `<iframe width="680" height="420" src="${url}${appendChar}embed=1&autoPlay=1" frameBorder="0" scrolling="no" allowfullscreen />`;
};

let timeout;

const clear = () => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
};

const EmbeddedShareButton = ({ url = '', size = 'medium', t, }) => {

  const [open, setOpen] = useState(false);

  const handleCopied = () => {
    clear();
    setOpen(true);
    timeout = setTimeout(() => setOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  return (
    <Popup
      open={open}
      content={t('messages.link-copied-to-clipboard')}
      position="bottom right"
      trigger={(
        <CopyToClipboard text={getEmbed(url)} onCopy={handleCopied}>
          <button className="custom_share_button">
            <Button
              as="span"
              icon="code"
              size={size}
              circular
              className="custom_share_button"
            />
          </button>
        </CopyToClipboard>
      )}
    />

  );
};

export default withTranslation()(EmbeddedShareButton);
