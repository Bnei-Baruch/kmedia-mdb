import React, { useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { Media } from 'react-media-player';
import isEqual from 'react-fast-compare';

import { selectors as settings } from '../../../../../redux/modules/settings';
import { MT_AUDIO } from '../../../../../helpers/consts';
import playerHelper from '../../../../../helpers/player';
import { isEmpty } from '../../../../../helpers/utils';
import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import { canonicalLink } from '../../../../../helpers/links';
import * as shapes from '../../../../shapes';
import AVMobileCheck from '../../../../AVPlayer/AVMobileCheck';
import { useRecommendedUnits } from '../Recommended/Main/Recommended';


const AVBox = ({ unit, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const history = useHistory();
  const location = useLocation();

  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const [playerLanguage, setPlayerLanguage] = useState(contentLanguage);
  const [playableItem, setPlayableItem] = useState(null);
  const [mediaEditMode, setMediaEditMode] = useState(0);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const handleChangeLanguage = useCallback((e, language) => playerHelper.setLanguageInQuery(history, language), [history]);
  const handleMediaEditModeChange = useCallback(newMediaEditMode => setMediaEditMode(newMediaEditMode), []);
  const handleDropdownOpenedChange = useCallback(dropdownOpened => setIsDropdownOpened(dropdownOpened), []);

  useEffect(() => {
    const preferredMT = playerHelper.restorePreferredMediaType();
    const mediaType = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const newPlayerLanguage = playerHelper.getLanguageFromQuery(location, playerLanguage);
    const newPlayableItem = playerHelper.playableItem(unit, mediaType, uiLanguage, newPlayerLanguage);

    setPlayerLanguage(newPlayableItem.language);
    setPlayableItem(playItem => isEqual(playItem, newPlayableItem) ? playItem : newPlayableItem);
  }, [unit, location, playerLanguage, uiLanguage]);

  useEffect(() => {
    playerHelper.setLanguageInQuery(history, playerLanguage);
  }, [history, playerLanguage]);


  const handleSwitchAV = useCallback(() => {
    if (playableItem) {
      playerHelper.switchAV(playableItem, history);
    }
  }, [history, playableItem]);


  const recommendedUnits = useRecommendedUnits({});

  const onFinish = () => {
    const nextRecommendedUnit = recommendedUnits?.length > 0 ? recommendedUnits[0] : null;

    if (nextRecommendedUnit) {
      const link = canonicalLink(nextRecommendedUnit);
      history.push(link);
    }
  };

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
      'mobile-device': isMobileDevice,
    })}
    >
      <div className="avbox__media-wrapper">
        <Media>
          <AVMobileCheck
            autoPlay={true}
            item={playableItem}
            preImageUrl={playableItem.preImageUrl}
            onSwitchAV={handleSwitchAV}
            languages={playableItem.availableLanguages}
            uiLanguage={uiLanguage}
            selectedLanguage={playableItem.language}
            requestedLanguage={playerLanguage}
            onLanguageChange={handleChangeLanguage}
            onMediaEditModeChange={handleMediaEditModeChange}
            onDropdownOpenedChange={handleDropdownOpenedChange}
            onFinish={onFinish}
          />
        </Media>
      </div>
    </div>
  );
}

AVBox.propTypes = {
  unit: shapes.ContentUnit,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(AVBox);