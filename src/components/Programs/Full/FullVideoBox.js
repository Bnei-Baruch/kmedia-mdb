import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Button, Divider, Grid, Header, Menu } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { physicalFile } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import LanguageSelector from '../../shared/LanguageSelector';
import AVPlayer from '../../shared/AVPlayer';

class FullVideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    fullProgram: shapes.ProgramCollection.isRequired,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activePart: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      language: undefined,
      isVideo: true,
      isAudio: false,
      files: this.buildFiles(props.fullProgram.content_units),
    };
  }

  componentDidMount() {
    const { fullProgram } = this.props;

    // Update files
    let { files }    = this.state;
    let stateUpdated = false;

    const newFiles = this.buildFiles(fullProgram.content_units);
    if (newFiles.size) {
      files        = new Map([...files, ...newFiles]);
      stateUpdated = true;
    }

    if (stateUpdated) {
      this.setState({ files });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fullProgram } = nextProps;
    const props          = this.props;

    // Update files
    let { files }    = this.state;
    let stateUpdated = false;

    // Clear files if new full program was set.
    if (fullProgram !== props.fullProgram && fullProgram.id !== props.fullProgram.id) {
      files        = new Map();
      stateUpdated = true;
    }

    // Wait for program parts to load.
    const newFiles = this.buildFiles(fullProgram.content_units);
    if (newFiles.size) {
      files        = new Map([...files, ...newFiles]);
      stateUpdated = true;
    }

    if (stateUpdated) {
      this.setState({ files });
    }
  }

  /**
   * @param {!Array<Object>} files
   * @return {Map<string, Map<string, file>>} map of files by language, then type (audio/video)
   */
  getFilesByLanguageByAV = (files) => {
    const ret = new Map();

    (files || []).forEach((file) => {
      // TODO: What is the difference between mimetype and type?!
      if ((['audio/mpeg', 'video/mp4'].includes(file.mimetype)) &&
        ([MT_VIDEO, MT_AUDIO].includes(file.type))) {
        if (!ret.has(file.language)) {
          ret.set(file.language, new Map());
        }
        ret.get(file.language).set(file.type, file);
      }
    });

    return ret;
  };

  buildFiles = (programParts) => {
    const files = new Map();
    programParts.forEach((p, i) => {
      if (p.files && p.files.length) {
        this.getFilesByLanguageByAV(p.files).forEach((filesByAV, language) => {
          if (!files.has(language)) {
            files.set(language, new Map());
          }
          filesByAV.forEach((file, audioOrVideo) => {
            if (!files.get(language).has(audioOrVideo)) {
              files.get(language).set(audioOrVideo, []);
            }
            files.get(language).get(audioOrVideo)[i] = file;
          });
        });
      }
    });
    return files;
  };

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  handleProgramPartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  handleOneHundredPercent = () => {
    const { activePart, fullProgram, onActivePartChange } = this.props;
    if (activePart < fullProgram.content_units.length - 1) {
      onActivePartChange(activePart + 1);
    }
  };

  handleVideo = () => {
    this.setState({ isVideo: true, isAudio: false });
  };

  handleAudio = () => {
    this.setState({ isAudio: true, isVideo: false });
  };

  render() {
    const { t, activePart, fullProgram, language: propsLanguage } = this.props;
    const { language = propsLanguage, files }                    = this.state;
    let { isVideo, isAudio }                                     = this.state;

    const filesByAV = files.get(language) || new Map();
    let fileList    = [];
    if (!filesByAV.has(MT_AUDIO)) {
      isAudio = undefined;
    } else if (isAudio) {
      fileList = filesByAV.get(MT_AUDIO) || [];
    }
    if (!filesByAV.has(MT_VIDEO)) {
      isVideo = undefined;
    } else if (isVideo) {
      fileList = filesByAV.get(MT_VIDEO) || [];
    }

    const titles = fullProgram.content_units.map((cu) => {
      const { name, duration } = cu;
      const ccuName            = fullProgram.ccuNames[cu.id];
      const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
      return `${ccuName} - ${name} - ${durationDisplay}`;
    });

    // Remove empty files, might be in case language or video/audio is missing.
    // Store idx in order to get feedback from the player to select the correct part.
    const playlist          = [];
    let playlistActiveIndex = null;
    fileList.forEach((file, idx) => {
      if (file) {
        // Set index in playlist to play.
        if (playlistActiveIndex === null || idx <= activePart) {
          playlistActiveIndex = playlist.length;
        }
        playlist.push({
          mediaid: idx,
          file: physicalFile(file, true),
          title: titles[idx],
        });
      }
    });

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer
              playerId="full-program"
              onOneHundredPercent={this.handleOneHundredPercent}
              playlist={playlist}
              playItem={playlistActiveIndex}
            />
          </div>
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button.Group fluid>
                  { isVideo === true ? <Button active color="blue" content={t('buttons.video')} /> : null }
                  { isVideo === false ? <Button content={t('buttons.video')} onClick={this.handleVideo} /> : null}
                  { isVideo === undefined ? <Button disabled content={t('buttons.video')} /> : null}
                  { isAudio === true ? <Button active color="blue" content={t('buttons.audio')} /> : null }
                  { isAudio === false ? <Button content={t('buttons.audio')} onClick={this.handleAudio} /> : null }
                  { isAudio === undefined ? <Button disabled content={t('buttons.audio')} /> : null}
                </Button.Group>
              </Grid.Column>
              <Grid.Column>
                <LanguageSelector
                  languages={Array.from(files.keys())}
                  defaultValue={language}
                  onSelect={this.handleChangeLanguage}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider />
          <Header
            as="h3"
            content={`${t(`constants.content-types.${fullProgram.content_type}`)} - ${(activePart + 1)}/${fullProgram.content_units.length}`}
            subheader={t('values.date', { date: new Date(fullProgram.film_date) })}
          />
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Menu vertical fluid size="small">
                  {
                    fullProgram.content_units.map((part, index) => (
                      <Menu.Item
                        key={part.id}
                        name={`${index}`}
                        content={titles[index]}
                        active={index === activePart}
                        onClick={this.handleProgramPartClick}
                      />
                    ))
                  }
                </Menu>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default FullVideoBox;
