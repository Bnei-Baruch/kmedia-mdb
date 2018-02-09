import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { Media } from 'react-media-player';

import classNames from 'classnames';
import withIsMobile from '../../../../../helpers/withIsMobile';
import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import * as shapes from '../../../../shapes';
import AVMobileCheck from '../../../../AVPlayer/AVMobileCheck';

class AVBox extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  componentWillMount() {
    const { isMobile, language, location, history, unit } = this.props;
    const mediaType                                       = playerHelper.getMediaTypeFromQuery(location, isMobile ? MT_AUDIO : MT_VIDEO);
    const playerLanguage                                  = playerHelper.getLanguageFromQuery(location, language);
    this.setPlayableItem(unit, mediaType, playerLanguage);
    playerHelper.setLanguageInQuery(history, playerLanguage);
  }

  componentWillReceiveProps(nextProps) {
    const { isMobile, unit, language } = nextProps;
    const props                        = this.props;

    const prevMediaType = playerHelper.getMediaTypeFromQuery(props.location, isMobile ? MT_AUDIO : MT_VIDEO);
    const newMediaType  = playerHelper.getMediaTypeFromQuery(nextProps.location, isMobile ? MT_AUDIO : MT_VIDEO);

    // no change
    if (unit === props.unit && language === props.language && prevMediaType === newMediaType) {
      return;
    }

    // Persist language in playableItem
    this.setPlayableItem(unit, newMediaType, this.state.playableItem.language);
  }

  setPlayableItem(unit, mediaType, language, cb) {
    const playableItem = playerHelper.playableItem(unit, mediaType, language);
    this.setState({ playableItem }, cb);
  }

  handleSwitchAV = () => {
    const { history }      = this.props;
    const { playableItem } = this.state;

    if (playableItem.mediaType === MT_VIDEO && playableItem.availableMediaTypes.includes(MT_AUDIO)) {
      playerHelper.setMediaTypeInQuery(history, MT_AUDIO);
    } else if (playableItem.mediaType === MT_AUDIO && playableItem.availableMediaTypes.includes(MT_VIDEO)) {
      playerHelper.setMediaTypeInQuery(history, MT_VIDEO);
    }
  };

  handleChangeLanguage = (e, language) => {
    const { playableItem }  = this.state;
    const { unit, history } = this.props;

    if (language !== playableItem.language) {
      this.setPlayableItem(unit, playableItem.mediaType, language);
    }

    playerHelper.setLanguageInQuery(history, language);
  };

  render() {
    const { t, isMobile }  = this.props;
    const { playableItem } = this.state;

    if (!playableItem || !playableItem.src) {
      return (<div>{t('messages.no-playable-files')}</div>);
    }

    return (
      <Grid.Row>
        <Grid.Column mobile={16} tablet={12} computer={10}>
          <div
            className={classNames('avbox__player', {
              'avbox__player--is-audio': playableItem.mediaType === MT_AUDIO,
              'avbox__player--is-4x3': playableItem.unit.film_date < '2014',
            })}
          >
            <div className="avbox__media-wrapper">
              <Media>
                <AVMobileCheck
                  item={playableItem}
                  onSwitchAV={this.handleSwitchAV}
                  languages={playableItem.availableLanguages}
                  language={playableItem.language}
                  onLanguageChange={this.handleChangeLanguage}
                  t={t}
                  preImageUrl={playableItem.preImageUrl}
                />
              </Media>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default withIsMobile(withRouter(AVBox));
