import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { formatTime } from '../../helpers/time';

class AVDuration extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.number,
    style: PropTypes.object,
    media: PropTypes.object.isRequired,
  };

  static defaultProps = {
    name: undefined,
    value: undefined
  };

  static defaultProps = {
    style: undefined
  };

  render() {
    const { style, name, value } = this.props;
    const time            = typeof value !== 'undefined' ? value : this.props.media[name];

    return (
      <time style={style}>
        {formatTime(time)}
      </time>
    );
  }
}

export default withMediaProps(AVDuration);
