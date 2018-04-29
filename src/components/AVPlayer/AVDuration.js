import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { formatTime } from '../../helpers/time';

class AVDuration extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.number,
    media: PropTypes.object.isRequired,
  };

  static defaultProps = {
    name: undefined,
    value: undefined,
  };

  render() {
    const { name, value, media } = this.props;
    const time                   = typeof value !== 'undefined' ? value : media[name];

    return (
      <time>
        {formatTime(time)}
      </time>
    );
  }
}

export default withMediaProps(AVDuration);
