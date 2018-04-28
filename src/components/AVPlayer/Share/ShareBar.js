import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Popup } from 'semantic-ui-react';

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

export default class ShareBarMobile extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    buttonSize: PropTypes.string,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    buttonSize: 'big',
  };

  state = {
    isOpen: false,
  };

  componentWillUnmount() {
    this.clearTimeout();
  }

  timeout = null;

  clearTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  handleCopied = () => {
    this.clearTimeout();
    this.setState({ isOpen: true }, () => {
      this.timeout = setTimeout(() => this.setState({ isOpen: false }), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  render() {
    const { url, buttonSize, t } = this.props;
    const bsPixels               = buttonSize === 'big' ? 46 : 36;

    const title = t('player.share.title');

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
          open={this.state.isOpen}
          content={t('messages.link-copied-to-clipboard')}
          position="bottom right"
          trigger={
            <CopyToClipboard text={url} onCopy={this.handleCopied}>
              <Button primary circular as="div" size={buttonSize} icon="chain" className="SocialMediaShareButton" />
            </CopyToClipboard>
          }
        />
      </div>
    );
  }
}
