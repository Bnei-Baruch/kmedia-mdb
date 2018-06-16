import React from 'react';
import { Form, Button, Popup, Input } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';

import BaseShareForm from './BaseShareForm';
import ShareBar from './ShareBar';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class ShareFormMobile extends BaseShareForm {
  constructor(props) {
    super(props);
    this.setStart = this.setStart.bind(this);
    this.setEnd   = this.setEnd.bind(this);
    this.state.isCopyPopupOpen = false;
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
    this.setState({ isCopyPopupOpen: true }, () => {
      this.timeout = setTimeout(() => this.setState({ isCopyPopupOpen: false }), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  componentWillUnmount() {
    this.clearTimeout();
  }


  render() {
    const { t }               = this.props;
    const { start, end, url } = this.state;

    return (
      <div className="mediaplayer__onscreen-share">
        <ShareBar url={url} t={t} showCopy={false} buttonSize="medium" />
        <div className="mediaplayer__onscreen-share-form">
          <div className="mediaplayer__onscreen-share-bar-mobile">
            <Input 
              className="mediaplayer__onscreen-share-bar-mobile-link" 
              value={url} 
              input={{ readOnly: true }} 
              style={{ textAlign: 'left' }} />
            <Popup
              open={this.state.isCopyPopupOpen}
              content={t('messages.link-copied-to-clipboard')}
              position="bottom right"
              trigger={
                <CopyToClipboard text={url} onCopy={this.handleCopied}>
                  <Button className="mobileShareCopyLinkButton" content={t('buttons.copy')} />
                </CopyToClipboard>
              }
            />
          </div>
          <Form size="mini">
            <Form.Group widths="equal">
              <Form.Input
                value={start ? this.mlsToStrColon(start) : ''}
                onClick={this.setStart}
                action={{
                  content: t('player.buttons.start-position'),
                  onClick: this.setStart,
                  icon: 'hourglass start',
                  compact: true,
                  color: 'blue',
                }}
                input={{ readOnly: true }}
                actionPosition="left"
                placeholder={t('player.buttons.click-to-set')}
                className="slice-button-mobile"
              />
              <Form.Input
                value={end ? this.mlsToStrColon(end) : ''}
                onClick={this.setEnd}
                action={{
                  content: t('player.buttons.end-position'),
                  onClick: this.setEnd,
                  icon: 'hourglass end',
                  compact: true,
                  color: 'blue',
                }}
                input={{ readOnly: true }}
                actionPosition="left"
                placeholder={t('player.buttons.click-to-set')}
                className="slice-button-mobile"
              />
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default ShareFormMobile;
