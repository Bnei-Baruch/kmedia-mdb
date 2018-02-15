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

  getKnobElement   = () => this.knobElement;
  getHandleElement = () => this.handleElement;

  render() {
    const { isEditMode, position, seconds, className } = this.props;

    return (
      <div
        className={classNames('seekbar__slicehandle', className)}
        style={{ left: position }}
        ref={(el) => { this.handleElement = el; }}
      >
        {
          isEditMode ?
            <div className="seekbar__slicehandle-time">
              {seconds}
            </div> :
            null
        }
        {
          isEditMode ?
            <div
              ref={(el) => { this.knobElement = el; }}
              className="seekbar__slicehandle-knob"
            /> :
            null
        }

        <div className="seekbar__slicehandle-line" />
      </div>
    );
  }
}
