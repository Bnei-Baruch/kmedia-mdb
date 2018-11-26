import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

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

class ShareBar extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    url: PropTypes.string,
    buttonSize: PropTypes.string,
    messageTitle: PropTypes.string
  };

  static defaultProps = {
    url: '',
    buttonSize: 'big',
    messageTitle: '',
  };

  getBsPixels = (buttonSize) => {
    switch (buttonSize) {
    default:
      return 46;
    case 'small':
      return 36;
    case 'tiny':
      return 26;
    }
  };

  render() {
    const { url, buttonSize, t, messageTitle } = this.props;

    if (!url) {
      return null;
    }

    // noinspection JSValidateTypes
    const bsPixels = this.getBsPixels(buttonSize);
    const title    = messageTitle || t('player.share.title');

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
      </div>
    );
  }
}

export default withNamespaces()(ShareBar);
