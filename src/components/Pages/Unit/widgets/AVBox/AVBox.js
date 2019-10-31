import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Grid } from 'semantic-ui-react';
import { Media } from 'react-media-player';
import isEqual from 'react-fast-compare';

import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import { selectors as device } from '../../../../../redux/modules/device';
import * as shapes from '../../../../shapes';
import AVMobileCheck from '../../../../AVPlayer/AVMobileCheck';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { isEmpty } from '../../../../../helpers/utils';

class AVBox extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    autoPlayAllowed: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  constructor(props) {
    super(props);
    const { uiLanguage, contentLanguage, location, history, unit } = props;
    const preferredMT                                              = playerHelper.restorePreferredMediaType();
    const mediaType                                                = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const playerLanguage                                           = playerHelper.getLanguageFromQuery(location, contentLanguage);
    const playableItem                                             = AVBox.getPlayableItem(unit, mediaType, playerLanguage, uiLanguage);
    this.state                                                     = {
      playableItem,
      autoPlay: true,
      newItemLanguage: null
    };
    playerHelper.setLanguageInQuery(history, playerLanguage);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { unit, uiLanguage, location } = nextProps;
    const { playableItem }               = this.state;
    const { language: playerLanguage }   = playableItem;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    // Persist language in playableItem
    const item = AVBox.getPlayableItem(unit, newMediaType, newItemLanguage, uiLanguage);
    this.setState({ playableItem: item, newItemLanguage });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { unit, uiLanguage, contentLanguage, location }                                                          = nextProps;
    const { unit: oldUnit, uiLanguage: oldUiLanguage, contentLanguage: oldContentLanguage, location: oldLocation } = this.props;
    const { playableItem, oldMediaEditMode, oldIsDropdownOpened }                                                  = this.state;
    const { language: playerLanguage }                                                                             = playableItem;
    const { mediaEditMode, isDropdownOpened }                                                                      = nextState;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const prevMediaType   = playerHelper.getMediaTypeFromQuery(oldLocation);
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    // no change
    return !(
      oldUiLanguage === uiLanguage
      && oldContentLanguage === contentLanguage
      && prevMediaType === newMediaType
      && newItemLanguage === playerLanguage
      && oldMediaEditMode === mediaEditMode
      && oldIsDropdownOpened === isDropdownOpened
      && isEqual(unit, oldUnit));
  }

  static getPlayableItem(unit, mediaType, playerLanguage, uiLanguage) {
    return playerHelper.playableItem(unit, mediaType, uiLanguage, playerLanguage);
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
    const { history } = this.props;
    playerHelper.setLanguageInQuery(history, language);
  };

  handleMediaEditModeChange = mediaEditMode => this.setState({ mediaEditMode });

  handleDropdownOpenedChange = isDropdownOpened => this.setState({ isDropdownOpened });

  render() {
    const { t, autoPlayAllowed, uiLanguage }                                           = this.props;
    const { playableItem, mediaEditMode, autoPlay, isDropdownOpened, newItemLanguage } = this.state;

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
              'avbox__player--is-audio--dropdown-opened': isAudio && isDropdownOpened && !mediaEditMode,
              'avbox__player--is-audio--dropdown-closed': isAudio && !isDropdownOpened && !mediaEditMode,
              'avbox__player--is-4x3': playableItem.unit.film_date < '2014',
              'mobile-device': !autoPlayAllowed,
            })}
          >
            <div className="avbox__media-wrapper">
              <Media>
                <AVMobileCheck
                  autoPlay={autoPlay}
                  item={playableItem}
                  preImageUrl={playableItem.preImageUrl}
                  onSwitchAV={this.handleSwitchAV}
                  languages={playableItem.availableLanguages}
                  uiLanguage={uiLanguage}
                  selectedLanguage={playableItem.language}
                  requestedLanguage={newItemLanguage}
                  onLanguageChange={this.handleChangeLanguage}
                  onMediaEditModeChange={this.handleMediaEditModeChange}
                  onDropdownOpenedChange={this.handleDropdownOpenedChange}
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

export default withRouter(connect(mapState)(withNamespaces()(AVBox)));
