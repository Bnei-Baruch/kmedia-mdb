import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Media } from 'react-media-player';

import classNames from 'classnames';
import withIsMobile from '../../../helpers/withIsMobile'
import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { parse, stringify } from '../../../helpers/url';
import * as shapes from '../../shapes';
import AVPlayer from '../../AVPlayerRMP/AVPlayerRMP';

const MEDIA_TYPES = {
  VIDEO: 'video',
  AUDIO: 'audio'
};

const DEFAULT_MEDIA_TYPE = MEDIA_TYPES.VIDEO;

class RMPVideoBox extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isSliceable: PropTypes.bool
  };

  static defaultProps = {
    unit: undefined,
    isSliceable: false
  };

  componentWillMount() {
    this.setState(this.calcState(this.props));
  }

  componentWillReceiveProps(nextProps) {
    const { unit = {}, language } = nextProps;
    const props                   = this.props;
    const state                   = this.state;

    const prevMediaType = this.getMediaTypeFromQuery(props.location);
    const newMediaType = this.getMediaTypeFromQuery(nextProps.location);

    // no change
    if (unit === props.unit && language === props.language && prevMediaType === newMediaType) {
      return;
    }

    // only language changed
    if (unit === props.unit && prevMediaType === newMediaType && language !== props.language) {
      if (state.groups.has(language)) {
        this.setState({ language, ...this.splitAV(language, state.groups) }, () => {
        });
        return;
      }
    }

    this.setState(this.calcState(nextProps));
  }

  calcState = (props) => {
    const { unit = {}, language, location } = props;
    const groups                  = this.getFilesByLanguage(unit.files);

    let lang;
    if (groups.has(language)) {
      lang = language;
    } else if (this.state && groups.has(this.state.language)) {
      lang = this.state.language;
    } else {
      lang = groups.keys().next().value;
    }

    const medias = lang ? this.splitAV(lang, groups) : {};
    const mediaType = this.getMediaTypeFromQuery(location);
    const active = this.getActiveByMediaType(mediaType, medias);

    return { groups, language: lang, ...medias, active };
  };

  getActiveByMediaType = (mediaType, medias) => {
    const validMediaType = MEDIA_TYPES[(mediaType || '').toUpperCase()] || DEFAULT_MEDIA_TYPE;
    return medias[validMediaType];
  }

  getMediaTypeFromQuery(location) {
    const query = parse(location.search.slice(1));
    return query.mediaType;
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
    const { history, location } = this.props;
    const { audio, video, active } = this.state;
    const query = parse(location.search.slice(1));
    if (active === video && audio) {
      query.mediaType = MEDIA_TYPES.AUDIO;
      this.setState({ active: audio });
    } else if (active === audio && video) {
      query.mediaType = MEDIA_TYPES.VIDEO;
      this.setState({ active: video });
    } else {
      // no change
      return;
    }

    history.replace({ search: stringify(query) });
  };

  handleChangeLanguage = (e, language) => {
    const { video, audio } = this.splitAV(language, this.state.groups);
    this.setState({ language, video, audio, active: video || audio });
  };

  render() {
    const { t, isMobile, isSliceable }                         = this.props;
    const { audio, video, active, groups, language } = this.state;

    if (!(video || audio)) {
      return (<div>{t('messages.no-playable-files')}</div>);
    }

    return (
      <Grid.Row className="video_box">
        <Grid.Column mobile={16} tablet={12} computer={10}>
          <div className={classNames("video_player", {"audio": audio === active})}>
            <div className="video_position">
              <Media>
                <AVPlayer
                  isSliceable={isSliceable}
                  active={active}
                  video={video}
                  audio={audio}
                  poster="http://kabbalahmedia.info/assets/cover-video.jpg"
                  onSwitchAV={this.handleSwitchAV}
                  languages={Array.from(groups.keys())}
                  defaultLanguage={language}
                  onLanguageChange={this.handleChangeLanguage}
                  t={t}
                  isMobile={isMobile}
                />
              </Media>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default withIsMobile(withRouter(RMPVideoBox));
