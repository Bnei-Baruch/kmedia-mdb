import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';

export default class SliceHandle extends Component {
  static propTypes = {
    position: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isEditMode: PropTypes.bool,
    onMove: PropTypes.func,
    onMoveEnd: PropTypes.func,
    seconds: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    isEditMode: false,
    onMove: noop,
    onMoveEnd: noop,
    className: ''
  };

  getKnobElement = () => this.knobElement;
  getHandleElement = () => this.handleElement;

  render() {
    const { isEditMode, position, seconds, className } = this.props;

    return (
      <div
        className={classNames('player-slice-handle', className)}
        style={{ left: position }}
        ref={(el) => { this.handleElement = el; }}
      >
        {
          isEditMode && (
            <div className="player-slice-handle__time">
              <span className="player-slice-handle__time__seconds">
                { seconds }
              </span>
            </div>
          )
        }
        { isEditMode && <div ref={(el) => { this.knobElement = el; }} className="player-slice-handle__knob" /> }
        <div className="player-slice-handle__line" />
      </div>
    );
  }
}
