import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Grid, Button, Menu, Divider } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { physicalFile } from '../../../helpers/utils';
import LanguageSelector from '../../shared/LanguageSelector';
import AVPlayer from '../../shared/AVPlayer';
import AVSwitch from '../Part/AVSwitch';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { actions } from '../../../redux/modules/lessons';

import map from 'lodash/map';
import moment from 'moment';
import 'moment-duration-format';

class FullVideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
    lessonParts: PropTypes.arrayOf(shapes.LessonPart),
  };

  static defaultProps = {
    fullLesson: undefined,
    lessonParts: [],
  };

  state = {
    activePartIndex: 0,
    language: undefined,
    isVideo: true,
    isAudio: false,
    files: new Map(),
  }

  componentWillReceiveProps(nextProps) {
    const { fullLesson, language, lessonParts } = nextProps;
    const props = this.props;

    // Wait for full lesson to load.
    if (fullLesson) {
      // Update files
      let { files } = this.state;
      let stateUpdated = false;
      // Wait for lesson parts to load.
      if (lessonParts) {
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
                stateUpdated = true;
              });
            });
          }
        });
      }
      if (fullLesson !== props.fullLesson && fullLesson.id !== props.fullLesson.id) {
        files = new Map();
        stateUpdated = true;
      }
      if (stateUpdated) {
        this.setState({ files });
      }
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

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  handleLessonPartClick = (e, { name }) => {
    this.setState({
      activePartIndex: parseInt(name),
    });
  }

  videoLoad = (e) => {
    console.log('Video Load', e);
    if (this.state.activePartIndex !== e.item.mediaid) {
      this.setState({
        activePartIndex: e.item.mediaid,
      });
    }
  }

  handleOnVideo = () => {
    this.setState({ isVideo: true, isAudio: false });
  }

  handleOnAudio = () => {
    this.setState({ isAudio: true, isVideo: false });
  }

  render() {
    const { fullLesson, lessonParts, language: propsLanguage } = this.props;
    let { activePartIndex, isVideo, isAudio, language = propsLanguage, files } = this.state;

    const filesByAV = files.get(language) || new Map();
    let fileList = [];
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

    console.log(files);
    console.log(language, isVideo, isAudio, fileList);

    if (!fileList[activePartIndex] && !lessonParts.every(p => p.files)) {
      return (<div>Loading...</div>);
    }

    const partTitle = (part) => part.name_in_collection + " - " + part.name + " - " + moment.duration(part.duration, 'seconds').format('hh:mm:ss');

    // Remove empty files, might be in case langage or video/audio is missing.
    // Store idx in order to get fedback from the player to select the correct part.
    const playlist = [];
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
          title: partTitle(lessonParts[idx]),
        });
      }
    });

    const lessonMenuItems = lessonParts.map((part, index) => (
      <Menu.Item key={index}
                 name={index.toString()}
                 active={index === activePartIndex}
                 onClick={this.handleLessonPartClick}>
        {partTitle(part)}
      </Menu.Item>
    ));

    console.log(activePartIndex, playlistActiveIndex);

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer playerId="lesson"
                      onVideoLoad={this.videoLoad}
                      playlist={playlist}
                      playItem={playlistActiveIndex}/>
          </div>
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button.Group fluid>
                  { isVideo === true      ? <Button active color="blue">Video</Button> : null }
                  { isVideo === false     ? <Button onClick={this.handleOnVideo}>Video</Button> : null}
                  { isVideo === undefined ? <Button disabled>Video</Button> : null}
                  { isAudio === true      ? <Button active color="blue">Audio</Button> : null }
                  { isAudio === false     ? <Button onClick={this.handleOnAudio}>Audio</Button> : null }
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
          <Header as="h3" subheader={fullLesson.film_date}
                  content={fullLesson.content_type + " - " + (activePartIndex + 1) + "/" + lessonParts.length} />
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Menu vertical fluid size="small">
                  { lessonMenuItems }
                </Menu>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

function connectLessonParts(state, props) {
  if (props.fullLesson) {
    return props.fullLesson.content_units.map(cu => {
      const u = mdb.getUnitById(state.mdb)(cu.id);
      if (!u || !u.files) {
        props.fetchLessonPart(cu.id);
      }
      return u;
    });
  } else {
    return [];
  }
}

export default connect(
  (state, ownProps) => ({
    lessonParts: connectLessonParts(state, ownProps)
  }),
  actions
)(FullVideoBox);
