import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Popup, } from 'semantic-ui-react';

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

const ShareSelected = ({ t, url, text, disable }) => {

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
    const bsPixels = 28;
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
              <FacebookShareButton url={url} quote={title} className="margin-right-4">
                <FacebookIcon size={bsPixels} round />
              </FacebookShareButton>
              <TwitterShareButton url={url} title={title} className="margin-right-4">
                <TwitterIcon size={bsPixels} round />
              </TwitterShareButton>
              <WhatsappShareButton url={url} title={title} separator=": " className="margin-right-4">
                <WhatsappIcon size={bsPixels} round />
              </WhatsappShareButton>
              <TelegramShareButton url={url} title={title} className="margin-right-4">
                <TelegramIcon size={bsPixels} round />
              </TelegramShareButton>
              <MailruShareButton url={url} title={title} className="margin-right-4">
                <MailruIcon size={bsPixels} round />
              </MailruShareButton>
              <EmailShareButton url={url} subject={title} body={url} className="margin-right-8">
                <EmailIcon size={bsPixels} round />
              </EmailShareButton>

              <Popup // link was copied message popup
                open={copyLinkOpen}
                content={t('messages.link-copied-to-clipboard')}
                position={`bottom left`}
                trigger={
                  (
                    <CopyToClipboard text={url} onCopy={handleLinkCopied} className="margin-right-4 nowrap">
                      <Button compact size="tiny" content={t('share-text.copy-link')} />
                    </CopyToClipboard>
                  )
                }
              />

              <Popup // link was copied message popup
                open={copyTextOpen}
                content={t('messages.text-copied-to-clipboard')}
                position={`bottom left`}
                trigger={
                  (
                    <CopyToClipboard text={text} onCopy={handleTextCopied} className="margin-right-4 nowrap">
                      <Button compact size="tiny" content={t('share-text.copy-text')} />
                    </CopyToClipboard>
                  )
                }
              />
              <Button compact size="tiny" content={t('share-text.disable-share')} onClick={disable} />
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
  disable: PropTypes.func,
};

export default withNamespaces()(ShareSelected);
