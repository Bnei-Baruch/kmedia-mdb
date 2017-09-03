import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Icon } from 'semantic-ui-react';

class AVShare extends Component {

  state = {
    url: ''
  };

  componentDidMount() {
    this.setState({
      url: window.location.href
    });
  }

  render() {
    return (
      <div className="player-button player-control-share">
        <CopyToClipboard text={this.state.url}>
          <Icon name="share" />
        </CopyToClipboard>
      </div>
    );
  }
}

export default AVShare;
