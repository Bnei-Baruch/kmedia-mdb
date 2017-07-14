// https://github.com/souporserious/react-media-player

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Grid } from 'semantic-ui-react';
import { controls, Media, Player } from 'react-media-player';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
import LanguageSelector from '../shared/LanguageSelector';

import AVPlayPause from './AVPlayPause';
import AVTime from './AVTime';
import AVSwitch from './AVSwitch';

const { MuteUnmute, Progress, SeekBar, Volume, Fullscreen } = controls;

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    playerId: PropTypes.string.isRequired,
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    handleSwitchAV: PropTypes.func.isRequired,
    // poster: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultValue: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    audio: null,
    video: null,
    active: null,
    mediaType: null,
    poster: null,
  };

  render() {
    const { audio, video, active, playerId, handleSwitchAV, languages, defaultValue, onSelect } = this.props;

    return (
      <div>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <AVSwitch video={video} audio={audio} active={active} onChange={handleSwitchAV} />
              </Grid.Column>
              <Grid.Column>
                <LanguageSelector
                  languages={languages}
                  defaultValue={defaultValue}
                  onSelect={onSelect}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Media>
          {
            ({ playPause }) => (
              <div className="media" id={playerId}>
                <div className="media-player">
                  <Player
                    src={physicalFile(active, true)}
                    vendor={active === video ? 'video' : 'audio'}
                    autoPlay={false}
                    loop="false"
                    controls
                    onClick={() => playPause()}
                  />
                </div>
                <div className="media-controls">
                  <AVPlayPause style={{ background: 'red' }} />
                  <AVTime name={'currentTime'} />
                  /
                  <AVTime name={'duration'} />
                  <Progress />
                  <SeekBar />
                  <MuteUnmute />
                  <Volume />
                  <Fullscreen />
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
