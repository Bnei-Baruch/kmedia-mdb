import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Media } from 'react-media-player';

import { selectors as settings } from '../../redux/modules/settings';
import { MT_AUDIO } from '../../helpers/consts';
import * as shapes from '../shapes';
import AVMobileCheck from './AVMobileCheck';
import { getQuery } from '../../helpers/url';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const AVPlaylistPlayer = ({ items, selected, onSelectedChange, onLanguageChange, onSwitchAV }) => {
  const { undefinedDevice } = useContext(DeviceInfoContext);
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const location = useLocation();
  const query = getQuery(location);

  const [autoPlay, setAutoPlay]                 = useState(!!query.sstart);
  const [mediaEditMode, setMediaEditMode]       = useState(null);
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const handleMediaEditModeChange = mediaEditMode => setMediaEditMode(mediaEditMode);
  const handleDropdownOpenedChange = isDropdownOpened => setIsDropdownOpened(isDropdownOpened);

  const onPlay = () => setAutoPlay(true);
  const onPause = () => setAutoPlay(false);

  const onPrev = () => {
    if (selected > 0) {
      onSelectedChange(selected - 1);
    }
  };

  const onNext = () => {
    if (selected < items.length - 1) {
      onSelectedChange(selected + 1);
    }
  };

  const onFinish = () => {
    onNext();
    setAutoPlay(true);
  };

  const currentItem = items[selected];

  // hasNext, hasPrev are not trivial as checking the indexes due to fact
  // that in some languages there might be missing audio or video file.
  const hasNext = selected < items.length - 1 && items.slice(selected).some(f => !!f.src);
  const hasPrev = selected > 0 && items.slice(0, selected).some(f => !!f.src);

  const isAudio = currentItem.mediaType === MT_AUDIO;

  return (
    <div
      className={classNames('avbox__player', {
        'avbox__player--is-audio': isAudio,
        'avbox__player--is-audio--edit-mode': isAudio && mediaEditMode === 2,
        'avbox__player--is-audio--normal-mode': isAudio && mediaEditMode === 0,
        'avbox__player--is-audio--dropdown-opened': isAudio && isDropdownOpened && !mediaEditMode,
        'avbox__player--is-audio--dropdown-closed': isAudio && !isDropdownOpened && !mediaEditMode,
        'avbox__player--is-4x3': currentItem.unit.film_date < '2014',
        'mobile-device': !undefinedDevice,
      })}
    >
      <div className="avbox__media-wrapper">
        <Media>
          <AVMobileCheck
            autoPlay={autoPlay}
            item={currentItem}
            onSwitchAV={onSwitchAV}
            languages={currentItem.availableLanguages}
            uiLanguage={uiLanguage}
            selectedLanguage={currentItem.language}
            requestedLanguage={contentLanguage}
            onLanguageChange={onLanguageChange}
            // Playlist props
            showNextPrev
            onFinish={onFinish}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPrev={onPrev}
            onNext={onNext}
            onPause={onPause}
            onPlay={onPlay}
            onMediaEditModeChange={handleMediaEditModeChange}
            onDropdownOpenedChange={handleDropdownOpenedChange}
          />
        </Media>
      </div>
    </div>
  );
}

AVPlaylistPlayer.propTypes   = {
  items: PropTypes.arrayOf(shapes.VideoItem).isRequired,
  selected: PropTypes.number.isRequired,
  onSelectedChange: PropTypes.func.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  onSwitchAV: PropTypes.func.isRequired,
};

export default AVPlaylistPlayer;
