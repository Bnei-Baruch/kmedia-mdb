import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Icon } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import TimedPopup from '../shared/TimedPopup';

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
  };

  componentDidMount() {
    this.setState({
      url: window.location.href
    });
  }

  timedPopup = null;

  share = () => {
    if (this.timedPopup) {
      this.timedPopup.open();
    }
  }

  render() {
    const { t, downward } = this.props;
    return (
      <div className="player-button player-control-share" onClick={this.share}>
        <CopyToClipboard text={this.state.url}>
          <div>
            <Icon name="share" />
            <TimedPopup
              ref={(p) => { this.timedPopup = p; }}
              message={t('messages.link-copied-to-clipboard')}
              downward={downward}
            />
          </div>
        </CopyToClipboard>
      </div>
    );
  }
}


export default translate()(AVShare);
