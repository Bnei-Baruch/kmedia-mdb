import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button, Popup } from 'semantic-ui-react';
import { translate } from 'react-i18next';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class AVShareLink extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    downward: false
  };

  state = {
    url: '',
    recentlyCopied: false
  };

  confirmTimeoutHandle = null;

  componentDidMount() {
    this.loadUrl();
  }

  componentWillReceiveProps(nextProps) {
    if (window.location.href !== this.state.url) {
      this.loadUrl();
    }
  }

  componentWillUnmount() {
    this.clearConfirmationTimeout();
  }

  loadUrl = () => {
    this.setState({
      url: window.location.href
    });
  };

  clearConfirmationTimeout = () => {
    if (this.confirmTimeoutHandle) {
      clearTimeout(this.confirmTimeoutHandle);
      this.confirmTimeoutHandle = null;
    }
  }

  handleCopied = () => {
    this.clearConfirmationTimeout();
    this.setState({ recentlyCopied: true }, () => {
      this.confirmTimeoutHandle = setTimeout(() => this.setState({ recentlyCopied: false }), POPOVER_CONFIRMATION_TIMEOUT);
    });
  };

  render() {
    const { t } = this.props;
    return (
      <Popup
        open={this.state.recentlyCopied}
        content={t('messages.link-copied-to-clipboard')}
        position="left center"
        offset={10}
        trigger={
          <CopyToClipboard text={this.state.url} onCopy={this.handleCopied}>
            <Button
              type="button"
              primary
              size="big"
              circular
              icon="chain"
            />
          </CopyToClipboard>
        }
      />
    );
  }
}

export default withRouter(translate()(AVShareLink));
