import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import LanguageSelector from '../../shared/LanguageSelector';
import AVPlayer from './AVPlayer';
import AVSwitch from './AVSwitch';

class VideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    lesson: shapes.LessonPart,
  };

  static defaultProps = {
    lesson: undefined,
  };

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props);
  }

  getInitialState = (props) => {
    const { lesson = {} } = props;
    const groups          = this.getFilesByLanguage(lesson.files);

    let language = props.language;
    if (!groups.has(language)) {
      language = groups.keys().next().value;
    }

    const { video, audio } = language ? this.splitAV(language, groups) : {};

    return { groups, language, video, audio, active: video || audio };
  };

  componentWillReceiveProps(nextProps) {
    const { lesson, language } = nextProps;
    const props                = this.props;
    const state                = this.state;

    // no change
    if (lesson === props.lesson && language === props.language) {
      return;
    }

    // only language changed
    if (lesson === props.lesson && language !== props.language) {
      if (state.groups.has(language)) {
        this.setState({ language, ...this.splitAV(language, state.groups) });
        return;
      }
    }

    // lesson changed, maybe language as well
    const groups = this.getFilesByLanguage(lesson.files);
    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (groups.has(state.language)) {
      lang = state.language;
    } else {
      lang = groups.keys().next().value;
    }

    const { video, audio } = lang ? this.splitAV(lang, groups) : {};
    this.setState({
      groups,
      language: lang,
      audio,
      video,
      active: video || audio
    });
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
    const { audio, video, active } = this.state;
    if (active === video && audio) {
      this.setState({ active: audio });
    } else if (active === audio && video) {
      this.setState({ active: video });
    }
  };

  handleChangeLanguage = (e, language) => {
    const { video, audio } = this.splitAV(language, this.state.groups);
    this.setState({ language, video, audio, active: video || audio });
  };

  render() {
    const { audio, video, active, groups, language } = this.state;

    if (!(video || audio)) {
      return (<div>No video/audio files.</div>);
    }

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer file={active} />
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
          </Grid>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default VideoBox;
