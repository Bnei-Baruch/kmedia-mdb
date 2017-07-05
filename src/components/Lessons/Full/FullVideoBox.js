import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Button, Menu } from 'semantic-ui-react';

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
    isVideo: undefined,
    isAudio: undefined,
  }

  componentWillReceiveProps(nextProps) {
    const { fullLesson, language } = nextProps;
    const props                    = this.props;

    // no change
    if (fullLesson === props.fullLesson) {
      console.log('No change');
      return;
    }

    // Lesson changed
    if (fullLesson && fullLesson !== props.fullLesson) {
      this.setState({ activePartIndex: 0 })
    }
  }

  calcPart = (part, language) => {
    const groups       = this.getFilesByLanguage(part.files);
    const state        = this.state;

    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (groups.has(state.language)) {
      lang = state.language;
    } else {
      lang = groups.keys().next().value;
    }

    const { video, audio } = lang ? this.splitAV(lang, groups) : {};

    return { part, groups, language: lang, video, audio, active: video || audio };
  };

  getFilesByLanguage = (files) => {
    const groups = new Map();

    (files || []).forEach((file) => {
      if (file.mimetype === 'audio/mpeg' || file.mimetype === 'video/mp4') {
        if (!groups.has(file.language)) {
          groups.set(file.language, []);
        }
        groups.get(file.language).push(file);
      }
    });

    return groups;
  };

  splitAV = (language, groups) => {
    const set   = groups.get(language);
    const video = set.find(file => file.type === MT_VIDEO);
    const audio = set.find(file => file.type === MT_AUDIO);
    return { video, audio };
  };

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  handleLessonPartClick = (e, { name }) => {
    this.setState({
      activePartIndex: parseInt(name),
    });
  }

  handleOnVideo = () => {
    this.setState({ isVideo: true });
  }

  handleOnAudio = () => {
    this.setState({ isAudio: true });
  }

  render() {
    const { lessonParts } = this.props;
    const { activePartIndex, isVideo, isAudio } = this.state;

    if (!lessonParts || !lessonParts.length) {
      return (<div>Loading...</div>);
    }

    console.log(lessonParts, activePartIndex);

    // Active lesson part.
    const { audio, video, active, groups, language } = this.calcPart(lessonParts[activePartIndex], this.props.language);

    if (!(video || audio)) {
      return (<div>No video/audio files.</div>);
    }

    const lessonMenuItems = lessonParts.map((part, index) => (
      <Menu.Item key={index} name={index.toString()}
                 active={index === activePartIndex}
                 onClick={this.handleLessonPartClick}>
        {part.name_in_collection} - {part.name} - {moment.duration(part.duration, 'seconds').format('hh:mm:ss')}
      </Menu.Item>
    ));

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer playerId="lesson" file={physicalFile(video /* active */, true)} />
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
                  languages={Array.from(groups.keys())}
                  defaultValue={language}
                  onSelect={this.handleChangeLanguage}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Menu vertical fluid color='blue'>
                { lessonMenuItems }
              </Menu>
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
