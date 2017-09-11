import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Media } from 'react-media-player';

import { MT_AUDIO, MT_VIDEO, PLAYABLE_MEDIA_TYPES } from '../../../helpers/consts';
import { parse, stringify } from '../../../helpers/url';
import playerHelper from '../../../helpers/player';
import * as shapes from '../../shapes';
import AVPlayer from '../../AVPlayerRMP/AVPlayerRMP';

class RMPVideoBox extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    language: PropTypes.string.isRequired,
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
    isSliceable: PropTypes.bool
  };

  static defaultProps = {
    unit: undefined,
    isSliceable: false
  };

  componentWillMount() {
    const { language, location } = this.props;
    const mediaType = this.getMediaTypeFromQuery(location);
    this.setPlayableItem(mediaType, language);
  }

  componentWillReceiveProps(nextProps) {
    const { unit, language } = nextProps;
    const props                   = this.props;

    const prevMediaType = this.getMediaTypeFromQuery(props.location);
    const newMediaType = this.getMediaTypeFromQuery(nextProps.location);

    // no change
    if (unit === props.unit && language === props.language && prevMediaType === newMediaType) {
      return;
    }

    this.setPlayableItem(newMediaType, language);
  }

  getMediaTypeFromQuery = (location, defaultMediaType = MT_VIDEO) => {
    const query = parse(location.search.slice(1));
    return PLAYABLE_MEDIA_TYPES.find(media => media === (query.mediaType || '').toLowerCase()) || defaultMediaType;
  };

  setPlayableItem(mediaType, language, cb) {
    const { unit } = this.props;
    const playableItem = playerHelper.playableItem(unit, mediaType, language);
    this.setState({ playableItem }, cb);
  }

  handleSwitchAV = () => {
    const { history, location } = this.props;
    const { playableItem } = this.state;

    const query = parse(location.search.slice(1));
    if (playableItem.mediaType === MT_VIDEO && playableItem.availableMediaTypes.includes(MT_AUDIO) ) {
      query.mediaType = MT_AUDIO;
    } else if (playableItem.mediaType === MT_AUDIO && playableItem.availableMediaTypes.includes(MT_VIDEO)) {
      query.mediaType = MT_VIDEO;
    } else {
      // no change
      return;
    }

    history.replace({ search: stringify(query) });
  };

  handleChangeLanguage = (e, language) => {
    const { language: oldLanguage, playableItem } = this.state;

    if (language !== oldLanguage) {
      this.setPlayableItem(playableItem.mediaType, language);
    }
  };

  render() {
    const { t, isSliceable }                         = this.props;
    const { playableItem, language } = this.state;

    if (!playableItem || !playableItem.src) {
      return (<div>{t('messages.no-playable-files')}</div>);
    }

    return (
      <Grid.Row className="video_box">
        <Grid.Column mobile={16} tablet={12} computer={10}>
          <div className="video_player">
            <div className="video_position">
              <Media>
                <AVPlayer
                  isSliceable={isSliceable}
                  item={playableItem}
                  poster="http://kabbalahmedia.info/assets/cover-video.jpg"
                  onSwitchAV={this.handleSwitchAV}
                  languages={playableItem.availableLanguages}
                  language={playableItem.language}
                  onLanguageChange={this.handleChangeLanguage}
                  t={t}
                />
              </Media>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default withRouter(RMPVideoBox);
