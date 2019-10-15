import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Message, Popup, } from 'semantic-ui-react';

import ShareBar from '../../AVPlayer/Share/ShareBar';
import { DeviceInfoContext } from "../../../helpers/app-contexts";

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class LibraryShare extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    t: PropTypes.func.isRequired,
    position: PropTypes.string.isRequired,
  };

  state = {
    isPopupOpen: false,
    isCopyOpen: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.closePopup);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.closePopup);
  }

  closePopup = () => {
    this.handlePopup(false);
  };

  handlePopup = (isPopupOpen) => {
    this.setState({ isPopupOpen });
  };

  handleCopied = () => {
    this.clearTimeout();
    this.setState({ isCopyOpen: true }, () => {
      this.timeout = setTimeout(() => this.setState({ isCopyOpen: false }), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  clearTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  };

  render() {
    const { t, position }            = this.props;
    const { isPopupOpen, isCopyOpen } = this.state;
    const { isMobileDevice }          = this.context;

    let url;
    if (isPopupOpen) {
      url = window.location.href;  // shouldn't be called during SSR
    }

    const buttonSize = isMobileDevice ? 'tiny' : 'small';

    return (
      <Popup // share bar popup
        className="share-bar"
        on="click"
        flowing
        hideOnScroll
        position={`bottom ${position}`}
        trigger={<Button compact size="small" icon="share alternate"/>}
        open={isPopupOpen}
        onClose={() => this.handlePopup(false)}
        onOpen={() => this.handlePopup(true)}
      >
        <Popup.Content>
          <ShareBar url={url} buttonSize={buttonSize} messageTitle={t('sources-library.share-title')}/>
          <Message content={url} size="mini"/>
          <Popup // link was copied message popup
            open={isCopyOpen}
            content={t('messages.link-copied-to-clipboard')}
            position={`bottom ${position}`}
            trigger={
              (
                <CopyToClipboard text={url} onCopy={this.handleCopied}>
                  <Button compact size="small" content={t('buttons.copy')} />
                </CopyToClipboard>
              )
            }
          />
        </Popup.Content>
      </Popup>
    );
  }
}

export default withNamespaces()(LibraryShare);
