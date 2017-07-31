import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withMediaProps } from 'react-media-player';

class AVDuration extends Component {
  static PropTypes = {
    name: PropTypes.string.isRequired
  };

  formatTime = (current) => {
    const h    = Math.floor(current / 3600);
    const m    = Math.floor((current - (h * 3600)) / 60);
    const s    = Math.floor(current % 60);
    const result = [];

    if (h > 0) {
      result.push(h > 10 ? `${h}` : `0${h}`);
    }
    result.push(m > 10 ? `${m}` : `0${m}`);
    result.push(s > 10 ? `${s}` : `0${s}`);

    return result.join(':');
  };

  render() {
    const { className, style, name } = this.props;
    const time                       = this.props.media[name];

    return (
      <time className={className} style={style}>
        { this.formatTime(time) }
      </time>
    );
  }
}

export default withMediaProps(AVDuration);
