import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

export default class SliceHandle extends Component {
  static propTypes = {
    position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isEditMode: PropTypes.bool,
    onMove: PropTypes.func,
    onMoveEnd: PropTypes.func
  };

  static defaultProps = {
    isEditMode: false,
    onMove: noop,
    onMoveEnd: noop
  };

  render() {
    const { isEditMode, position } = this.props;

    return (
      <div
        className="player-slice-handle"
        style={{ left: position }}
      >
        { isEditMode && <div className="player-slice-handle--knob" /> }
        <div className="player-slice-handle--line" />
      </div>
    );
  }
}
