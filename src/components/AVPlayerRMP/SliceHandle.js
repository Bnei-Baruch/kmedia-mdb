import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

export default class SliceHandle extends Component {
  static propTypes = {
    position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isEditMode: PropTypes.bool,
    onMove: PropTypes.func,
    onMoveEnd: PropTypes.func,
    seconds: PropTypes.string.isRequired
  };

  static defaultProps = {
    isEditMode: false,
    onMove: noop,
    onMoveEnd: noop
  };

  render() {
    const { isEditMode, position, seconds } = this.props;

    console.log(seconds);

    return (
      <div
        className="player-slice-handle"
        style={{ left: position }}
      >
        {
          isEditMode && (
            <div className="player-slice-handle--time">
              <span className="player-slice-handle--time--seconds">
                { seconds }
              </span>
            </div>
          )
        }
        { isEditMode && <div className="player-slice-handle--knob" /> }
        <div className="player-slice-handle--line" />
      </div>
    );
  }
}
