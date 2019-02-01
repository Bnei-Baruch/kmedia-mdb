import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message, Popup } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withNamespaces } from 'react-i18next';

import BaseShareForm from './BaseShareForm';
import ShareBar from './ShareBar';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class ShareFormDesktop extends BaseShareForm {
  static propTypes = {
    onExit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.setStart              = this.setStart.bind(this);
    this.setEnd                = this.setEnd.bind(this);
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

  getEmbed = (url) => {
    const appendChar = url.indexOf('?') !== -1 ? '&' : '?';
    return `<iframe width="680" height="420" src="${url}${appendChar}embed=1" frameBorder="0" scrolling="no" allowfullscreen />`;
  };

  render() {
    const { t, onExit }                        = this.props;
    const { start, end, url, isCopyPopupOpen } = this.state;

    return (
      <div className="mediaplayer__onscreen-share">
        <Button
          className="mediaplayer__onscreen-share-back"
          content={t('player.buttons.edit-back')}
          primary
          icon="chevron left"
          onClick={onExit}
        />
        <ShareBar url={url} embedContent={this.getEmbed(url)} t={t} buttonSize="medium" />
        <div className="mediaplayer__onscreen-share-form">
          <div className="mediaplayer__onscreen-share-bar">
            <Message content={url} size="mini" />
            <Popup
              open={isCopyPopupOpen}
              content={t('messages.link-copied-to-clipboard')}
              position="bottom right"
              trigger={(
                <CopyToClipboard text={url} onCopy={this.handleCopied}>
                  <Button className="shareCopyLinkButton" size="mini" content={t('buttons.copy')} />
                </CopyToClipboard>
              )}
            />
          </div>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                value={start ? BaseShareForm.mlsToStrColon(start) : ''}
                onClick={this.setStart}
                action={{
                  content: t('player.buttons.start-position'),
                  onClick: this.setStart,
                  icon: 'hourglass start',
                  color: 'blue',
                  size: 'mini',
                  compact: true,
                }}
                input={{ readOnly: true }}
                actionPosition="left"
                placeholder={t('player.buttons.click-to-set')}
              />
              <Form.Input
                value={end ? BaseShareForm.mlsToStrColon(end) : ''}
                onClick={this.setEnd}
                action={{
                  content: t('player.buttons.end-position'),
                  onClick: this.setEnd,
                  icon: 'hourglass end',
                  color: 'blue',
                  size: 'mini',
                  compact: true,
                }}
                input={{ readOnly: true }}
                actionPosition="left"
                placeholder={t('player.buttons.click-to-set')}
              />
            </Form.Group>
          </Form>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(ShareFormDesktop);
