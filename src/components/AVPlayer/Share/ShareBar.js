import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  MailruIcon,
  MailruShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';
import CutAndDownload from './TrimBtn';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const getBsPixels = buttonSize => {
  switch (buttonSize) {
    default:
      return 46;
    case 'small':
      return 36;
    case 'tiny':
      return 26;
  }
};

const ShareBar = props => {
  const {
    t,
    url          = '',
    buttonSize   = 'big',
    messageTitle = '',
    embedContent = null,
    sstart,
    send,
    file
  } = props;

  const [isEmbedPopupOpen, setIsEmbedPopupOpen] = useState(false);
  const { isMobileDevice }                      = useContext(DeviceInfoContext);

  let embedTimeout;

  const clearEmbedTimeout = () => {
    if (embedTimeout) {
      clearTimeout(embedTimeout);
      embedTimeout = null;
    }
  };

  const handleEmbedCopied = () => {
    clearEmbedTimeout();
    setIsEmbedPopupOpen(true);
    embedTimeout = setTimeout(() => setIsEmbedPopupOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
  };

  if (!url) {
    return null;
  }

  // noinspection JSValidateTypes
  const bsPixels = getBsPixels(buttonSize);
  const title    = messageTitle || t('player.share.title');

  return (
    <div className="social-buttons">
      {
        !isMobileDevice && (
          <CutAndDownload
            sstart={sstart}
            send={send}
            file={file}
            width={bsPixels - 1}
            size={buttonSize}
          />
        )
      }
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={bsPixels} round />
      </FacebookShareButton>
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={bsPixels} round />
      </TwitterShareButton>
      <WhatsappShareButton url={url} title={title} separator=": ">
        <WhatsappIcon size={bsPixels} round />
      </WhatsappShareButton>
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={bsPixels} round />
      </TelegramShareButton>
      <MailruShareButton url={url} title={title}>
        <MailruIcon size={bsPixels} round />
      </MailruShareButton>
      <EmailShareButton url={url} subject={title} body={url}>
        <EmailIcon size={bsPixels} round />
      </EmailShareButton>

      {
        embedContent &&
        <Popup
          open={isEmbedPopupOpen}
          content={t('messages.link-copied-to-clipboard')}
          position="bottom right"
          trigger={(
            <CopyToClipboard text={embedContent} onCopy={handleEmbedCopied}>
              <Button
                icon="code"
                style={{ width: `${bsPixels - 1}px`, height: `${bsPixels - 1}px` }}
                size="big"
                circular
                className="embed-share-button"
              />
            </CopyToClipboard>
          )}
        />
      }
    </div>
  );
};

ShareBar.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string,
  embedContent: PropTypes.string,
  buttonSize: PropTypes.string,
  messageTitle: PropTypes.string,
};

export default withNamespaces()(ShareBar);