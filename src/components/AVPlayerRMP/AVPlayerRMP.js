import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Media, Player } from 'react-media-player';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
import AVPlayPause from './AVPlayPause';
import AVCenteredPlay from './AVCenteredPlay';
import AVTimeElapsed from './AVTimeElapsed';
import AVFullScreen from './AVFullScreen';
import AVMuteUnmute from './AVMuteUnmute';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';
import AVProgress from './AVProgress';

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    onSwitchAV: PropTypes.func.isRequired,
    // poster: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultValue: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    audio: null,
    video: null,
    active: null,
    mediaType: null,
    poster: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      videoElement: null,
    };
  }

  componentDidMount() {
    const videoElement = this.player_.instance;
    this.setState({ videoElement });
  }

  buffers = () => {
    const { videoElement } = this.state;
    const ret              = [];
    if (videoElement) {
      for (let idx = 0; idx < videoElement.buffered.length; ++idx) {
        ret.push({
          start: videoElement.buffered.start(idx),
          end: videoElement.buffered.end(idx)
        });
      }
    }
    return ret;
  };

  render() {
    const { audio, video, active, onSwitchAV, languages, defaultValue, onLanguageChange, t } = this.props;

    return (
      <div>
        <Media>
          {
            ({ playPause }) => (
              <div className="media">
                <div className="media-player">
                  <Player
                    ref={c => this.player_ = c}
                    src={physicalFile(active, true)}
                    vendor={active === video ? 'video' : 'audio'}
                    autoPlay={false}
                    loop="false"
                    preload="auto"
                    onClick={playPause}
                  />
                  <div className="media-controls">
                    <div className="controls-container">
                      <AVPlayPause />
                      <AVTimeElapsed />
                      <AVProgress buffers={this.buffers()} />
                      <AVMuteUnmute />
                      <AVAudioVideo
                        isAudio={audio === active}
                        isVideo={video === active}
                        setAudio={onSwitchAV}
                        setVideo={onSwitchAV}
                        t={t}
                      />
                      <AVLanguage
                        languages={languages}
                        defaultValue={defaultValue}
                        onSelect={onLanguageChange}
                      />
                      <AVFullScreen />
                    </div>
                  </div>
                  <div className="media-center-control">
                    <div className="control-container">
                      <AVCenteredPlay />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </Media>
      </div>
    );
  }
}

export default AVPlayerRMP;
