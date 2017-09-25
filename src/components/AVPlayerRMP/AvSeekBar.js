import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import noop from 'lodash/noop';
import { withMediaProps } from 'react-media-player';
import classNames from 'classnames';
import { PLAYER_MODE } from './constants';
import { playerModeProp } from './propTypes';
import SliceHandle from './SliceHandle';
import { formatTime } from '../../helpers/time';

class AvSeekBar extends Component {

  static propTypes = {
    media: PropTypes.object.isRequired, // TODO: (yaniv) use right propType
    buffers: PropTypes.array,
    playerMode: playerModeProp.isRequired,
    sliceStart: PropTypes.number,
    sliceEnd: PropTypes.number,
    onSliceStartChange: PropTypes.func,
    onSliceEndChange: PropTypes.func,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    buffers: [],
    sliceStart: 0,
    sliceEnd: Infinity,
    onSliceStartChange: noop,
    onSliceEndChange: noop
  };

  element              = null;
  wasMouseDown         = false;
  isPlayingOnMouseDown = false;

  state = {
    seekbarHadInteraction: false,
    playPoint: this.props.media.currentTime
  };

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMove, { passive: false });
    document.addEventListener('touchmove', this.handleMove, { passive: false });
    document.addEventListener('mouseup', this.handleEnd, { passive: false });
    document.addEventListener('touchend', this.handleEnd, { passive: false });
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
    document.removeEventListener('touchend', this.handleEnd);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.sliceStartActive && !this.sliceEndActive && this.props.media.currentTime !== nextProps.media.currentTime) {
      this.setState({ playPoint: nextProps.media.currentTime });
    }
  }

  handleStart = (e) => {
    this.wasMouseDown         = true;
    this.isPlayingOnMouseDown = this.props.media.isPlaying;

    this.props.media.pause();

    if (this.sliceStartHandle && e.target === this.sliceStartHandle.getKnobElement()) {
      this.sliceStartActive = true;
    } else if (this.sliceEndHandle && e.target === this.sliceEndHandle.getKnobElement()) {
      this.sliceEndActive = true;
    } else {
      this.sliceStartActive = false;
      this.sliceEndActive = false;
    }

    if (!this.state.seekbarHadInteraction) {
      this.setState({ seekbarHadInteraction: true });
    }
  };

  handleMove = (e) => {
    const { onSliceStartChange, onSliceEndChange, sliceStart, sliceEnd, media } = this.props;
    if (this.wasMouseDown) {
      e.preventDefault();
      // Resolve clientX from mouse or touch event.
      const clientX = e.touches ? e.touches[e.touches.length - 1].clientX : e.clientX;
      const seekPosition = this.getSeekPositionFromClientX(clientX);

      if (this.sliceStartActive) {
        if (seekPosition < sliceEnd) {
          onSliceStartChange(seekPosition);
        }
      } else if (this.sliceEndActive) {
        if (seekPosition > sliceStart) {
          onSliceEndChange(seekPosition);
        }
      }

      media.seekTo(seekPosition);
    }
  };

  handleEnd = (e) => {
    const { media } = this.props;
    if (this.wasMouseDown) {
      e.preventDefault();
      this.wasMouseDown = false;

      if (e.clientX) {
        // pause when dragging handles
        if (this.sliceStartActive === true || this.sliceEndActive === true) {
          this.props.media.pause();
        }

        const seekPosition = this.getSeekPositionFromClientX(e.clientX);
        media.seekTo(seekPosition);
        this.setState({ playPoint: seekPosition });
      }

      // only play if media was playing prior to mouseDown
      if (!this.sliceStartActive && !this.sliceEndActive && this.isPlayingOnMouseDown) {
        this.props.media.play();
      }

      this.sliceStartActive = false;
      this.sliceEndActive = false;
    }
  };

  getSeekPositionFromClientX = (clientX) => {
    const { media } = this.props;
    const { left, right } = this.element.getBoundingClientRect();
    const { duration }    = media;
    const offset          = Math.min(Math.max(0, clientX - left), right - left);

    return (duration * offset) / (right - left);
  }

  toPercentage = (l) => {
    const ret = 100 * l;
    if (ret > 100) {
      return '100%';
    }
    return (ret < 1) ? 0 : `${ret}%`;
  };

  getNormalizedSliceStart = (duration) => {
    const { sliceEnd } = this.props;
    let { sliceStart } = this.props;
    if (!isNumber(sliceStart)) {
      return 0;
    }

    if (sliceStart > sliceEnd) {
      sliceStart = sliceEnd;
    }

    if (duration < sliceStart) {
      sliceStart = duration;
    }

    if (sliceStart < 0) {
      sliceStart = 0;
    }

    return sliceStart / duration;
  }

  getNormalizedSliceEnd = (duration) => {
    const { sliceStart } = this.props;
    let { sliceEnd } = this.props;

    if (!isNumber(sliceEnd)) {
      return 1;
    }

    if (sliceEnd < sliceStart) {
      sliceEnd = sliceStart;
    }

    if (sliceEnd > duration) {
      sliceEnd = duration;
    }

    if (sliceEnd < 0) {
      sliceEnd = 0;
    }

    return sliceEnd / duration;
  }

  render() {
    const { isMobile, sliceStart, sliceEnd } = this.props;
    const { currentTime, duration } = this.props.media;
    const current                   = this.state.playPoint / duration;
    // Overriding progress of native react-media-player as he does not works correctly
    // with buffers.
    const { buffers, playerMode } = this.props;
    const buf         = buffers.find(b => b.start <= currentTime && b.end >= currentTime);
    const progress    = (buf && (buf.end / duration)) || current;

    const isSliceEdit = playerMode === PLAYER_MODE.SLICE_EDIT;
    const isSliceView = playerMode === PLAYER_MODE.SLICE_VIEW;
    const isSlice = playerMode === isSliceEdit || isSliceView;
    const normalizedSliceStart = this.getNormalizedSliceStart(duration);
    const normalizedSliceEnd = this.getNormalizedSliceEnd(duration);

    let playedLeft = 0;
    if (isSliceView && !this.state.seekbarHadInteraction) {
      playedLeft = normalizedSliceStart;
    }
    const playedWidth = Math.max(0, current - playedLeft);


    const stylePlayed = {
      left: this.toPercentage(playedLeft),
      width: this.toPercentage(playedWidth),
    };

    const styleLoaded = {
      width: progress,
      left: 0
    };

    const sliceStartLeft = this.toPercentage(normalizedSliceStart);
    const sliceEndLeft = this.toPercentage(normalizedSliceEnd);

    return (
      <div
        ref={el => this.element = el}
        className="player-control-seekbar-container"
        onMouseDown={this.handleStart}
        onTouchStart={this.handleStart}
      >
        {
          isSliceEdit && (
            <SliceHandle
              ref={el => this.sliceStartHandle = el}
              seconds={formatTime(sliceStart)}
              position={sliceStartLeft}
              isEditMode={playerMode === PLAYER_MODE.SLICE_EDIT}
            />
          )
        }
        {
          isSliceEdit && (
            <SliceHandle
              ref={el => this.sliceEndHandle = el}
              seconds={formatTime(sliceEnd === Infinity ? duration : sliceEnd)}
              position={sliceEndLeft}
              isEditMode={playerMode === PLAYER_MODE.SLICE_EDIT}
            />
          )
        }
        <div
          className={
            classNames('player-control-seekbar', {
              mobile: isMobile
            }
          )}
        >
          {
            isSlice && (
              <div
                className="player-slice-area"
                style={{
                  left: sliceStartLeft,
                  width: this.toPercentage(normalizedSliceEnd - normalizedSliceStart)
                }}
              />
            )
          }
          <div className="bar empty" />
          <div className="bar played" style={stylePlayed}>
            <div className={classNames('knob', { mobile: isMobile })} />
          </div>
          <div className="bar loaded" style={styleLoaded} />
        </div>
      </div>
    );
  }
}

export default withMediaProps(AvSeekBar);
