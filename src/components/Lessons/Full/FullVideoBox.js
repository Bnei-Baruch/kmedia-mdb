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
    fullLesson: shapes.LessonCollection.isRequired,
  };

  state = {
    activePartIndex: 0,
    language: undefined,
    isVideo: true,
    isAudio: false,
    files: new Map(),
  };

  componentDidMount() {
    const { fullLesson } = this.props;

    // Update files
    let { files }    = this.state;
    let stateUpdated = false;

    const newFiles = this.buildFiles(fullLesson.content_units);
    if (newFiles.size) {
      files        = new Map([...files, ...newFiles]);
      stateUpdated = true;
    }

    if (stateUpdated) {
      this.setState({ files });
    }

  }

  componentWillReceiveProps(nextProps) {
    const { fullLesson } = nextProps;
    const props          = this.props;

    // Update files
    let { files }    = this.state;
    let stateUpdated = false;

    // Clear files if new full lesson was set.
    if (fullLesson !== props.fullLesson && fullLesson.id !== props.fullLesson.id) {
      files        = new Map();
      stateUpdated = true;
    }

    // Wait for lesson parts to load.
    const newFiles = this.buildFiles(fullLesson.content_units);
    if (newFiles.size) {
      files        = new Map([...files, ...newFiles]);
      stateUpdated = true;
    }

    if (stateUpdated) {
      this.setState({ files });
    }

  }

  buildFiles = (lessonParts) => {
    const files = new Map();
    lessonParts.forEach((p, i) => {
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

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  handleLessonPartClick = (e, { name }) => {
    this.setState({
      activePartIndex: parseInt(name, 10),
    });
  };

  videoLoad = (e) => {
    console.log('Video Load', e);
    if (this.state.activePartIndex !== e.item.mediaid) {
      this.setState({
        activePartIndex: e.item.mediaid,
      });
    }
  };

  handleOnVideo = () => {
    this.setState({ isVideo: true, isAudio: false });
  };

  handleOnAudio = () => {
    this.setState({ isAudio: true, isVideo: false });
  };

  partTitle = (part) => {
    const { name_in_collection: ccuName, name, duration } = part;
    return `${ccuName} - ${name} - ${moment.duration(duration, 'seconds').format('hh:mm:ss')}`;
  };

  render() {
    const { fullLesson, language: propsLanguage }                              = this.props;
    let { activePartIndex, isVideo, isAudio, language = propsLanguage, files } = this.state;

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

    // Remove empty files, might be in case language or video/audio is missing.
    // Store idx in order to get feedback from the player to select the correct part.
    const playlist          = [];
    let playlistActiveIndex = null;
    fileList.forEach((file, idx) => {
      if (file) {
        // Set index in playlist to play.
        if (playlistActiveIndex === null || idx <= activePartIndex) {
          playlistActiveIndex = playlist.length;
        }
        playlist.push({
          mediaid: idx,
          file: physicalFile(file, true),
          title: this.partTitle(fullLesson.content_units[idx]),
        });
      }
    });

    console.log(activePartIndex, playlistActiveIndex);

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer
              playerId="lesson"
              onVideoLoad={this.videoLoad}
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
                  { isVideo === true ? <Button active color="blue">Video</Button> : null }
                  { isVideo === false ? <Button onClick={this.handleOnVideo}>Video</Button> : null}
                  { isVideo === undefined ? <Button disabled>Video</Button> : null}
                  { isAudio === true ? <Button active color="blue">Audio</Button> : null }
                  { isAudio === false ? <Button onClick={this.handleOnAudio}>Audio</Button> : null }
                  { isAudio === undefined ? <Button disabled>Audio</Button> : null}
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
            content={`${fullLesson.content_type} - ${(activePartIndex + 1)}/${fullLesson.content_units.length}`}
            subheader={fullLesson.film_date}
          />
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Menu vertical fluid size="small">
                  {
                    fullLesson.content_units.map((part, index) => (
                      <Menu.Item
                        key={part.id}
                        name={part.id}
                        content={this.partTitle(part)}
                        active={index === activePartIndex}
                        onClick={this.handleLessonPartClick}
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
