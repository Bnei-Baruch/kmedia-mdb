import React, { Component } from 'react';
import { Button, Transition } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { ShareButtons, generateShareIcon, } from 'react-share';

const {
        FacebookShareButton,
        GooglePlusShareButton,
        TwitterShareButton,
        //PinterestShareButton,
        //VKShareButton,
        //OKShareButton,
        //TelegramShareButton,
        WhatsappShareButton,
        //RedditShareButton,
        EmailShareButton,
        //TumblrShareButton,
        //LivejournalShareButton,
        //MailruShareButton,
      } = ShareButtons;

const FacebookIcon   = generateShareIcon('facebook');
const TwitterIcon    = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const EmailIcon      = generateShareIcon('email');
const WhatsappIcon   = generateShareIcon('whatsapp');

class AVShare extends Component {
  state = {
    shareUrl: '',
    visible: false
  };

  static propTypes = {
    shareUrl: PropTypes.string,
  };

  componentDidMount() {
    this.loadUrl(this.props.shareUrl);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.shareUrl !== this.props.shareUrl) || (window.location.href !== this.state.shareUrl)) {
      this.loadUrl(nextProps.shareUrl);
    }
  }

  loadUrl = (url) =>
    this.setState({ shareUrl: url || window.location.href });

  handleClick = () => this.setState({
    visible: !this.state.visible
  });

  render() {
    const { visible, shareUrl } = this.state;
    const { t }                 = this.props;
    const title                 = t('player.share.title');
    const buttonSize            = 46;
    return (
      <div className='social-share'>
        <Button
          type="button"
          primary
          size="big"
          circular
          icon={'share alternate'}
          onClick={this.handleClick}
        />
        <Transition visible={visible} animation='scale' duration={500}>
          <div className='social-buttons'>
            <FacebookShareButton url={shareUrl} quote={title}>
              <FacebookIcon size={buttonSize} round />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
              <TwitterIcon size={buttonSize} round />
            </TwitterShareButton>
            <WhatsappShareButton url={shareUrl} title={title} separator=":: ">
              <WhatsappIcon size={buttonSize} round />
            </WhatsappShareButton>
            <GooglePlusShareButton url={shareUrl}>
              <GooglePlusIcon size={buttonSize} round />
            </GooglePlusShareButton>
            <EmailShareButton url={shareUrl} subject={title} body="body">
              <EmailIcon size={buttonSize} round />
            </EmailShareButton>
          </div>
        </Transition>
      </div>
    );
  }
}

export default translate()(AVShare);
