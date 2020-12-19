import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Media } from 'react-media-player';
import isEqual from 'react-fast-compare';

import { MT_AUDIO, MT_VIDEO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import * as shapes from '../../../../shapes';
import AVMobileCheck from '../../../../AVPlayer/AVMobileCheck';
import { selectors as settings } from '../../../../../redux/modules/settings';
import { isEmpty } from '../../../../../helpers/utils';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';

class AVBox extends Component {
  static contextType = DeviceInfoContext;
  static propTypes   = {
    unit: shapes.ContentUnit,
    history: shapes.History.isRequired,
    location: shapes.HistoryLocation.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  static getMediaType = (location) => {
    const preferredMT = playerHelper.restorePreferredMediaType();
    return playerHelper.getMediaTypeFromQuery(location, preferredMT);
  };

  constructor(props) {
    super(props);
    const { uiLanguage, contentLanguage, location, history, unit } = props;

    const mediaType      = AVBox.getMediaType(location);
    const playerLanguage = playerHelper.getLanguageFromQuery(location, contentLanguage);
    const playableItem   = playerHelper.playableItem(unit, mediaType, uiLanguage, playerLanguage);

    this.state = {
      playableItem,
      autoPlay: true,
      newItemLanguage: playerLanguage
    };

    playerHelper.setLanguageInQuery(history, playerLanguage);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { unit, uiLanguage, contentLanguage, location }         = nextProps;
    const
      {
        unit: oldUnit,
        uiLanguage: oldUiLanguage,
        contentLanguage: oldContentLanguage,
        location: oldLocation
      }                                                           = this.props;
    const { playableItem, oldMediaEditMode, oldIsDropdownOpened } = this.state;
    const { language: playerLanguage }                            = playableItem;
    const { mediaEditMode, isDropdownOpened }                     = nextState;

    const preferredMT     = playerHelper.restorePreferredMediaType();
    const prevMediaType   = playerHelper.getMediaTypeFromQuery(oldLocation);
    const newMediaType    = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);

    const equal = oldUiLanguage === uiLanguage
      && oldContentLanguage === contentLanguage
      && prevMediaType === newMediaType
      && newItemLanguage === playerLanguage
      && oldMediaEditMode === mediaEditMode
      && oldIsDropdownOpened === isDropdownOpened
      && unit && oldUnit && unit.id === oldUnit.id;

    return !equal;
  }

  componentDidUpdate() {
    this.setPlayableItemState();
  }

  handleSwitchAV = () => {
    const { playableItem } = this.state;

    if (playableItem.mediaType === MT_VIDEO
      && playableItem.availableMediaTypes.includes(MT_AUDIO)) {
      this.setMediaType(MT_AUDIO);
    } else if (playableItem.mediaType === MT_AUDIO
      && playableItem.availableMediaTypes.includes(MT_VIDEO)) {
      this.setMediaType(MT_VIDEO);
    }
  };

  setMediaType(mediaType) {
    const { history } = this.props;

    playerHelper.setMediaTypeInQuery(history, mediaType);
    playerHelper.persistPreferredMediaType(mediaType);

    this.setPlayableItemState(mediaType);
  }

  setPlayableItemState(mediaType) {
    const { unit, uiLanguage, location } = this.props;
    const { playableItem }               = this.state;
    const { language: playerLanguage }   = playableItem;

    if (!mediaType) {
      mediaType = AVBox.getMediaType(location);
    }

    const newItemLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);
    const newPlayableItem = playerHelper.playableItem(unit, mediaType, uiLanguage, newItemLanguage);

    if (!isEqual(playableItem, newPlayableItem)) {
      this.setState({ playableItem: newPlayableItem, newItemLanguage });
    }
  }

  handleChangeLanguage = (e, language) => {
    const { history } = this.props;
    playerHelper.setLanguageInQuery(history, language);
  };

  handleMediaEditModeChange = mediaEditMode => this.setState({ mediaEditMode });

  handleDropdownOpenedChange = isDropdownOpened => this.setState({ isDropdownOpened });

  render() {
    const { t, uiLanguage }                                                            = this.props;
    const { playableItem, mediaEditMode, autoPlay, isDropdownOpened, newItemLanguage } = this.state;
    const { undefinedDevice }                                                          = this.context;

    if (isEmpty(playableItem)) {
      return (<div>{t('messages.no-playable-files')}</div>);
    }

    const isAudio = playableItem.mediaType === MT_AUDIO;

    return (
      <div className={classNames('avbox__player', {
        'avbox__player--is-audio': isAudio,
        'avbox__player--is-audio--edit-mode': isAudio && mediaEditMode === 2,
        'avbox__player--is-audio--normal-mode': isAudio && mediaEditMode === 0,
        'avbox__player--is-audio--dropdown-opened': isAudio && isDropdownOpened && !mediaEditMode,
        'avbox__player--is-audio--dropdown-closed': isAudio && !isDropdownOpened && !mediaEditMode,
        'avbox__player--is-4x3': playableItem.unit.film_date < '2014',
        'mobile-device': !undefinedDevice,
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
    );
  }
}

const mapState = state => ({
  uiLanguage: settings.getLanguage(state.settings),
  contentLanguage: settings.getContentLanguage(state.settings),
});

export default withRouter(connect(mapState)(withNamespaces()(AVBox)));
