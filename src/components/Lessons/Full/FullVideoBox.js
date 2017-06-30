import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Menu } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { physicalFile } from '../../../helpers/utils';
import LanguageSelector from '../../shared/LanguageSelector';
import AVPlayer from '../../shared/AVPlayer';
import AVSwitch from '../Part/AVSwitch';

import moment from 'moment';
import 'moment-duration-format';

class FullVideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    // lesson: shapes.LessonPart,  <== optional param should override state.
    fullLesson: shapes.LessonCollection,
  };

  static defaultProps = {
    fullLesson: undefined,
  };

  constructor(props) {
    super(props);
    this.state = this.calcFullState(props);
  }

  calcFullState = (props) => {
    const { fullLesson } = props;
    if (!fullLesson || !fullLesson.content_units || !fullLesson.content_units.length) {
      return {};
    } else {
      const id = this.state && this.state.activePartId || fullLesson.content_units[0].id;
      const part = this.fetchLessonIfNeeded(id)
      return {
        activePartId: id,
        parts: {
          [id]: {
            part: part,
            ...this.calcPartState(part, props),
          }
        },
      };
    }
  }

  fetchLessonIfNeeded = (partId) => {
    const lessonPart = this.props.getUnitById(partId);
    if (!lessonPart || !lessonPart.files) {
      this.props.fetchLessonPart(partId);
      return undefined;
    }
    return lessonPart;
  }

  calcPartState = (part = {}, props) => {
    const { language } = props;
    const groups       = this.getFilesByLanguage(part.files);
    const state        = this.state;

    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (state && groups.has(state.language)) {
      lang = state.language;
    } else {
      lang = groups.keys().next().value;
    }

    const { video, audio } = lang ? this.splitAV(lang, groups) : {};

    return { groups, language: lang, video, audio, active: video || audio };
  };

  componentWillReceiveProps(nextProps) {
    const { fullLesson = {}, language } = nextProps;
    const props                = this.props;

    // no change
    if (fullLesson === props.fullLesson && language === props.language) {
      console.log('No change');
      return;
    }

    this.setState(this.calcFullState(nextProps));
  }

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

  handleSwitchAV = () => {
    const parts = this.state.parts;
    const part = this.state.parts[this.state.activePartId];
    const { audio, video, active } = part;
    if (active === video && audio) {
      part.active = audio;
    } else if (active === audio && video) {
      part.video = audio;
    }
    this.setState({ parts: { ...parts, [this.state.activePartId]: part } });
  };

  handleChangeLanguage = (e, language) => {
    const { video, audio } = this.splitAV(language, this.state.parts[this.state.activePartId].groups);
    this.setState({ language, video, audio, active: video || audio });
  };

  handleLessonPartClick = (e, { name }) => {
    const part = this.fetchLessonIfNeeded(name);
    this.setState({
      activePartId: name,
      activePart: part,
      ...this.calcPartState(part, this.props),
    });
  }

  render() {
    const { fullLesson } = this.props;
    const { parts = [], activePartId } = this.state;
    // Active lesson part.
    const { audio, video, active, groups, language } = parts[activePartId] || {};

    if (!(activePartId || video || audio)) {
      return (<div>No video/audio files.</div>);
    }

    console.log(activePartId, video, audio);

    const lessonMenuItems = fullLesson.content_units.map(part => (
      <Menu.Item key={part.id} name={part.id}
                 active={part.id === activePartId}
                 onClick={this.handleLessonPartClick}>
        {part.name_in_collection} - {part.name} - {moment.duration(part.duration, 'seconds').format('hh:mm:ss')}
      </Menu.Item>
    ));

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer playerId="lesson" file={physicalFile(active, true)} />
          </div>
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <AVSwitch video={video} audio={audio} active={active} onChange={this.handleSwitchAV} />
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

export default FullVideoBox;
