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
import { selectors as settings } from '../../../../../redux/modules/settings';
import { equal, isEmpty } from '../../../../../helpers/utils';

class AVBox extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    language: PropTypes.string.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    autoPlayAllowed: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  componentWillMount() {
    const { uiLanguage, contentLanguage, location, history, unit }
                         = this.props;
    const preferredMT    = playerHelper.restorePreferredMediaType();
    const mediaType      = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const playerLanguage = playerHelper.getLanguageFromQuery(location, contentLanguage);
    this.setPlayableItem(unit, mediaType, playerLanguage, uiLanguage);
    playerHelper.setLanguageInQuery(history, playerLanguage);
  }

  componentWillReceiveProps(nextProps) {
    const { unit, uiLanguage, location } = nextProps;
    const { language: playerLanguage }   = this.state.playableItem;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    // Persist language in playableItem
    this.setPlayableItem(unit, newMediaType, newItemLanguage, uiLanguage);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { unit, uiLanguage, contentLanguage, location } = nextProps;
    const { unit: oldUnit, uiLanguage: oldUiLanguage, contentLanguage: oldContentLanguage, location: oldLocation }
                                                          = this.props;
    const { language: playerLanguage }                    = this.state.playableItem;
    const { mediaEditMode }                               = nextState;
    const { oldMediaEditMode }                            = this.state;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const prevMediaType   = playerHelper.getMediaTypeFromQuery(oldLocation);
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    // no change
    return !(equal(unit, oldUnit) &&
      oldUiLanguage === uiLanguage &&
      oldContentLanguage === contentLanguage &&
      prevMediaType === newMediaType &&
      newItemLanguage === playerLanguage  &&
      oldMediaEditMode === mediaEditMode);
  }

  setPlayableItem(unit, mediaType, playerLanguage, uiLanguage) {
    const playableItem = playerHelper.playableItem(unit, mediaType, uiLanguage, playerLanguage);
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

  handleMediaEditModeChange = (mediaEditMode) => {    
    this.setState({mediaEditMode: mediaEditMode});
  };

  render() {
    const { t, autoPlayAllowed }                = this.props;
    const { playableItem, mediaEditMode }       = this.state;

    if (isEmpty(playableItem)) {
      return (<div>{t('messages.no-playable-files')}</div>);
    }

    const isAudio = playableItem.mediaType === MT_AUDIO;

    return (
      <Grid.Row>
        <Grid.Column mobile={16} tablet={12} computer={10}>
          <div
            className={classNames('avbox__player', {
              'avbox__player--is-audio': isAudio,
              'avbox__player--is-audio--edit-mode': isAudio && mediaEditMode === 2,
              'avbox__player--is-audio--normal-mode': isAudio && mediaEditMode === 0,
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
                  onMediaEditModeChange={this.handleMediaEditModeChange}
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
  uiLanguage: settings.getLanguage(state.settings),
  contentLanguage: settings.getContentLanguage(state.settings),
});

export default withRouter(connect(mapState)(AVBox));
