import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';

import ShareBar from '../AVPlayer/Share/ShareBar';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import useStateWithCallback from '../../helpers/use-state-with-callback';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton, MailruIcon, MailruShareButton, TelegramIcon, TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

const ShareSelected = ({ t, url, text }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const contextRef = useRef();

  const [copyLinkOpen, setCopyLinkOpen] = useStateWithCallback(false, copyLinkOpen => {
    if (copyLinkOpen) {
      timeout = setTimeout(() => setCopyLinkOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  const [copyTextOpen, setCopyTextOpen] = useStateWithCallback(false, copyTextOpen => {
    if (copyTextOpen) {
      timeout = setTimeout(() => setCopyTextOpen(false), POPOVER_CONFIRMATION_TIMEOUT);
    }
  });

  let timeout = undefined;

  const handleLinkCopied = () => {
    clearPopupTimeout();
    setCopyLinkOpen(true);
  };
  const handleTextCopied = () => {
    clearPopupTimeout();
    setCopyTextOpen(true);
  };

  const clearPopupTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const render = () => {
    const bsPixels = 36;
    const title    = t('share-text.message-title');

    return (
      <>
        <div className="search-on-page--bar-position" ref={contextRef}></div>

        <Popup // share bar popup
          className="share-bar search-on-page--share-bar"
          context={contextRef}
          basic
          position={`bottom left`}
          trigger={<div />}
          open
          hideOnScroll
        >
          <Popup.Content>
            {/*<ShareBar url={url} buttonSize={buttonSize} messageTitle={} className="search-on-page--share-bar" />*/}


            <div className="social-buttons">
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

              <Popup // link was copied message popup
                open={copyLinkOpen}
                content={t('messages.link-copied-to-clipboard')}
                position={`bottom left`}
                trigger={
                  (
                    <CopyToClipboard text={url} onCopy={handleLinkCopied}>
                      <Button compact size="small" content={t('share-text.copy_link')} />
                    </CopyToClipboard>
                  )
                }
              />

              <Popup // link was copied message popup
                open={copyTextOpen}
                content={t('share-text.copy_text')}
                position={`bottom left`}
                trigger={
                  (
                    <CopyToClipboard text={text} onCopy={handleTextCopied}>
                      <Button compact size="small" content={t('share-text.copy_text')} />
                    </CopyToClipboard>
                  )
                }
              />
            </div>
          </Popup.Content>
        </Popup>
      </>
    );
  };

  return render();
};

ShareSelected.propTypes = {
  t: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
};

export default withNamespaces()(ShareSelected);
