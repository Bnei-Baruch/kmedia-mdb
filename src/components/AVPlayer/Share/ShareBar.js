import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  GooglePlusIcon,
  GooglePlusShareButton,
  MailruIcon,
  MailruShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

export default class ShareBar extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    url: PropTypes.string,
    embedContent: PropTypes.string,
    buttonSize: PropTypes.string,
    messageTitle: PropTypes.string
  };

  static defaultProps = {
    url: '',
    buttonSize: 'big',
    messageTitle: '',
  };

  state = {
    isEmbedPopupOpen: false
  };

  getBsPixels = (buttonSize) => {
    switch (buttonSize) {
    default: return 46;
    case 'small': return 36;
    case 'tiny': return 26;
    }
  }

  clearEmbedTimeout = () => {
    if (this.embedTimeout) {
      clearTimeout(this.embedTimeout);
      this.embedTimeout = null;
    }
  };

  handleEmbedCopied = () => {
    this.clearEmbedTimeout();
    this.setState({ isEmbedPopupOpen: true }, () => {
      this.embedTimeout = setTimeout(() => this.setState({ isEmbedPopupOpen: false }), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  render() {
    const { url, buttonSize, t, messageTitle, embedContent } = this.props;
    const { isEmbedPopupOpen }                               = this.state;
    
    if (!url) {
      return null;
    }

    // noinspection JSValidateTypes
    const bsPixels  = this.getBsPixels(buttonSize);
    const title     = messageTitle || t('player.share.title');

    return (
      <div className="social-buttons">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={bsPixels} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={bsPixels} round />
        </TwitterShareButton>
        <GooglePlusShareButton url={url}>
          <GooglePlusIcon size={bsPixels} round />
        </GooglePlusShareButton>
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

        <Popup             
              open={isEmbedPopupOpen}              
              content={t('messages.link-copied-to-clipboard')}
              position="bottom right"
              trigger={
                <CopyToClipboard text={embedContent} onCopy={this.handleEmbedCopied}>
                  <Button icon="code" size="big" circular className="embed-share-button" />
                </CopyToClipboard>
              }
            />
      </div>
    );
  }
}
