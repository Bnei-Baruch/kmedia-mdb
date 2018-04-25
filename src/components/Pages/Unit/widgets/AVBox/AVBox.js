import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Grid } from 'semantic-ui-react';
import { Media } from 'react-media-player';

import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import { selectors as device } from '../../../../../redux/modules/device';
import * as shapes from '../../../../shapes';
import AVMobileCheck from '../../../../AVPlayer/AVMobileCheck';

class AVBox extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    autoPlayAllowed: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  componentWillMount() {
    const { language, location, history, unit } = this.props;
    const preferredMT                           = playerHelper.restorePreferredMediaType();
    const mediaType                             = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const playerLanguage                        = playerHelper.getLanguageFromQuery(location, language);
    this.setPlayableItem(unit, mediaType, playerLanguage);
    playerHelper.setLanguageInQuery(history, playerLanguage);
  }

  componentWillReceiveProps(nextProps) {
    const { unit, language } = nextProps;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const prevMediaType   = playerHelper.getMediaTypeFromQuery(this.props.location);
    const newMediaType    = playerHelper.getMediaTypeFromQuery(nextProps.location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(nextProps.location, this.state.playableItem.language);

    // no change
    if (unit === this.props.unit &&
      language === this.props.language &&
      prevMediaType === newMediaType &&
      newItemLanguage === this.state.playableItem.language) {
      return;
    }

    // Persist language in playableItem
    this.setPlayableItem(unit, newMediaType, newItemLanguage);
  }

  setPlayableItem(unit, mediaType, language) {
    const playableItem = playerHelper.playableItem(unit, mediaType, language);
    this.setState({ playableItem });
  }

  handleSwitchAV = () => {
    const { history }      = this.props;
    const { playableItem } = this.state;

    if (playableItem.mediaType === MT_VIDEO && playableItem.availableMediaTypes.includes(MT_AUDIO)) {
      playerHelper.setMediaTypeInQuery(history, MT_AUDIO);
      playerHelper.persistPreferredMediaType(MT_AUDIO);
    } else if (playableItem.mediaType === MT_AUDIO && playableItem.availableMediaTypes.includes(MT_VIDEO)) {
      playerHelper.setMediaTypeInQuery(history, MT_VIDEO);
      playerHelper.persistPreferredMediaType(MT_VIDEO);
    }
  };

  handleChangeLanguage = (e, language) => {
    playerHelper.setLanguageInQuery(this.props.history, language);
  };

  render() {
    const { t, autoPlayAllowed } = this.props;
    const { playableItem }       = this.state;

    if (!playableItem) {
      return (<div>{t('messages.no-playable-files')}</div>);
    }

    return (
      <Grid.Row>
        <Grid.Column mobile={16} tablet={12} computer={10}>
          <div
            className={classNames('avbox__player', {
              'avbox__player--is-audio': playableItem.mediaType === MT_AUDIO,
              'avbox__player--is-4x3': playableItem.unit.film_date < '2014',
              'mobile-device': !autoPlayAllowed,
            })}
          >
            <div className="avbox__media-wrapper">
              <Media>
                <AVMobileCheck
                  item={playableItem}
                  preImageUrl={playableItem.preImageUrl}
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

const mapState = state => ({
  autoPlayAllowed: device.getAutoPlayAllowed(state.device),
});

export default withRouter(connect(mapState)(AVBox));
