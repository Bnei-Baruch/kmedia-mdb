import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Button, Divider, Grid, Header, Menu } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { physicalFile } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import LanguageSelector from '../../shared/LanguageSelector';
import AVPlayer from '../../AVPlayerRMP/AVPlayerRMP';

class FullVideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection.isRequired,
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
      autoPlay: false,
      language: undefined,
      isVideo: true,
      isAudio: false,
      files: this.buildFiles(props.fullLesson.content_units),
    };
  }

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

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  handleLessonPartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  onFinish = () => {
    const { activePart, fullLesson, onActivePartChange } = this.props;
    if (activePart < fullLesson.content_units.length - 1) {
      onActivePartChange(activePart + 1);
    }
    this.setState({ autoPlay: true });
  };

  onNext = () => {
    const { activePart, fullLesson, onActivePartChange } = this.props;
    if (activePart < fullLesson.content_units.length - 1) {
      onActivePartChange(activePart + 1);
    }
  }

  onPrev = () => {
    const { activePart, onActivePartChange } = this.props;
    if (activePart > 0) {
      onActivePartChange(activePart - 1);
    }
  }

  onPlay = () => {
    this.setState({ autoPlay: true });
  }

  onPause = () => {
    this.setState({ autoPlay: false });
  }

  handleSwitchAV = () => {
    if (this.state.isAudio && this.state.isVideo !== undefined) {
      this.setState({ isAudio: false, isVideo: true });
    }
    if (this.state.isVideo && this.state.isAudio !== undefined) {
      this.setState({ isAudio: true, isVideo: false });
    }
  }

  render() {
    const { t, activePart, fullLesson, language: propsLanguage } = this.props;
    const { autoPlay, language = propsLanguage, files }          = this.state;
    let { isVideo, isAudio }                                     = this.state;

    const filesByAV = files.get(language) || new Map();
    let audioFileList = [];
    if (!filesByAV.has(MT_AUDIO)) {
      isAudio = undefined;
    } else if (isAudio) {
      audioFileList = filesByAV.get(MT_AUDIO) || [];
    }
    let videoFileList = [];
    if (!filesByAV.has(MT_VIDEO)) {
      isVideo = undefined;
    } else if (isVideo) {
      videoFileList = filesByAV.get(MT_VIDEO) || [];
    }

    const titles = fullLesson.content_units.map((cu) => {
      const { name, duration } = cu;
      const ccuName            = fullLesson.ccuNames[cu.id];
      const durationDisplay    = moment.duration(duration, 'seconds').format('hh:mm:ss');
      return `${ccuName} - ${name} - ${durationDisplay}`;
    });

    // Remove empty files, might be in case language or video/audio is missing.
    // Store idx in order to get feedback from the player to select the correct part.
    const audioPlaylist = [];
    let audioPlaylistActiveIndex = null;
    audioFileList.forEach((file, idx) => {
      if (file) {
        // Set index in playlist to play.
        if (audioPlaylistActiveIndex === null || idx <= activePart) {
          audioPlaylistActiveIndex = audioPlaylist.length;
        }
        audioPlaylist.push({
          mediaid: idx,
          file: physicalFile(file, true),
          title: titles[idx],
        });
      }
    });

    const videoPlaylist = [];
    let videoPlaylistActiveIndex = null;
    videoFileList.forEach((file, idx) => {
      if (file) {
        // Set index in playlist to play.
        if (videoPlaylistActiveIndex === null || idx <= activePart) {
          videoPlaylistActiveIndex = videoPlaylist.length;
        }
        videoPlaylist.push({
          mediaid: idx,
          file: physicalFile(file, true),
          title: titles[idx],
        });
      }
    });

    console.log(videoPlaylistActiveIndex, videoFileList.length);

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer
              autoPlay={autoPlay}
              active={isVideo ? videoFileList[videoPlaylistActiveIndex] : audioFileList[audioPlaylistActiveIndex]}
              video={videoFileList[videoPlaylistActiveIndex]}
              audio={audioFileList[audioPlaylistActiveIndex]}
              poster="http://kabbalahmedia.info/assets/cover-video.jpg"
              onSwitchAV={this.handleSwitchAV}
              languages={Array.from(files.keys())}
              defaultLanguage={language}
              onLanguageChange={this.handleChangeLanguage}
              t={t}
              // Playlist props
              onFinish={this.onFinish}
              showNextPrev={true}
              hasNext={isVideo ? videoPlaylistActiveIndex < videoFileList.length - 1 : audioPlaylistActiveIndex < audioFileList.length - 1}
              hasPrev={isVideo ? videoPlaylistActiveIndex > 0 : audioPlaylistActiveIndex > 0}
              onPrev={this.onPrev}
              onNext={this.onNext}
              onPause={this.onPause}
              onPlay={this.onPlay}
            />
          </div>
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button.Group fluid>
                  { isVideo === true ? <Button active color="blue" content={t('buttons.video')} /> : null }
                  { isVideo === false ? <Button content={t('buttons.video')} onClick={this.handleSwitchAV} /> : null}
                  { isVideo === undefined ? <Button disabled content={t('buttons.video')} /> : null}
                  { isAudio === true ? <Button active color="blue" content={t('buttons.audio')} /> : null }
                  { isAudio === false ? <Button content={t('buttons.audio')} onClick={this.handleSwitchAV} /> : null }
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
            content={`${t(`constants.content-types.${fullLesson.content_type}`)} - ${(activePart + 1)}/${fullLesson.content_units.length}`}
            subheader={t('values.date', { date: new Date(fullLesson.film_date) })}
          />
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Menu vertical fluid size="small">
                  {
                    fullLesson.content_units.map((part, index) => (
                      <Menu.Item
                        key={part.id}
                        name={`${index}`}
                        content={titles[index]}
                        active={index === activePart}
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
