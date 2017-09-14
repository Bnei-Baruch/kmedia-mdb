import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Icon, Popup } from 'semantic-ui-react';
import { translate } from 'react-i18next';

const POPOVER_CONFIRMATION_TIMEOUT = 2500;

class AVShare extends Component {

  static propTypes = {
    t: PropTypes.func.isRequired,
    downward: PropTypes.bool
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
    this.setState({
      url: window.location.href
    });
  }

  componentWillUnmount() {
    this.clearConfirmationTimeout();
  }

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
    const { t, downward } = this.props;
    return (
      <div className="player-button player-control-share">
        <Popup
          open={this.state.recentlyCopied}
          content={t('player.share.confirmation')}
          position={`${downward ? 'bottom' : 'top'} right`}
          offset={10}
          trigger={
            <CopyToClipboard text={this.state.url} onCopy={this.handleCopied}>
              <Icon name="share" />
            </CopyToClipboard>
          }
        />
      </div>
    );
  }
}

export default translate()(AVShare);
