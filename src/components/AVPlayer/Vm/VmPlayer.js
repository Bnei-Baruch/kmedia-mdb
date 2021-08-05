import React, { useEffect, useRef, useState } from 'react';
import { Player, usePlayerContext, } from '@vime/react';

import { VmControls } from './VmControls';
import { VmProvider } from './VmProvider';
import { VmSettings } from './VmSettings';
import { isEmpty } from '../../../helpers/utils';

// Default theme. ~960B
import '@vime/core/themes/default.css';
import PropTypes from 'prop-types';
import * as shapes from '../../shapes';
import ClientChronicles from '../../../helpers/clientChronicles';
import { withNamespaces } from 'react-i18next';
import playerHelper from '../../../helpers/player';
import { MT_VIDEO, VS_DEFAULT, VS_FHD, VS_HD, VS_NHD } from '../../../helpers/consts';
import { PLAYER_MODE } from '../constants';
import ShareFormDesktop from '../Share/ShareFormDesktop';
// Optional light theme (extends default). ~400B
// import '@vime/core/themes/light.css';

const chooseSource = (item, t) => {
  if (isEmpty(item.byQuality)) {
    return { error: true, errorReason: t('messages.no-playable-files') };
  }

  let videoQuality = playerHelper.restorePreferredVideoSize();
  let src          = item.byQuality[videoQuality];

  // if we can't find the user preferred video size we fallback.
  // first we try to go down from where he was.
  // if we can't find anything on our way down we start go up.
  if (!src) {
    const vss    = [VS_NHD, VS_HD, VS_FHD];
    const idx    = vss.indexOf(videoQuality);
    const o      = vss.slice(0, idx).reverse().concat(vss.slice(idx + 1));
    videoQuality = o.find(x => !!item.byQuality[x]);
    src          = item.byQuality[videoQuality];
  }

  return { src, videoQuality };
};

const VmPlayer = ({
  item,

  onSwitchAV,

  selectedLanguage,
  languages,
  onLanguageChange,

  showNextPrev = false,
  hasPrev = false,
  onPrev = null,
  hasNext = false,
  onNext = null,

  mode,
  uiLanguage,

  t,
}) => {
  const player = useRef(null);

  const [duration]                    = usePlayerContext(player, 'duration', 0);
  const [currentTime, setCurrentTime] = usePlayerContext(player, 'currentTime', 0);
  const [playbackReady]               = usePlayerContext(player, 'playbackReady', false);
  const [mediaType]                   = usePlayerContext(player, 'mediaType', undefined);

  const [source, setSource]             = useState({});
  const [isVideo, setIsVideo]           = useState(item.mediaType === MT_VIDEO);
  const [videoQuality, setVideoQuality] = useState(VS_DEFAULT);

  const [wasCurrentTime, setWasCurrentTime] = useState(0);

  const [editMode, setMode]         = useState(mode);
  const [isEditMode, setIsEditMode] = useState(mode === PLAYER_MODE.SLICE_EDIT);
  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd]     = useState(duration);

  useEffect(() => {

  }, [isEditMode]);

  useEffect(() => {
    const { src, videoQuality } = chooseSource(item, t);
    setVideoQuality(videoQuality);
    setSource(src);
    setIsVideo(item.mediaType === MT_VIDEO);
  }, [item]);

  useEffect(() => {
    if (playbackReady && wasCurrentTime > 0) {
      setCurrentTime(wasCurrentTime);
      setWasCurrentTime(0);
    }
  }, [playbackReady]);

  const setEditMode = (properties = {}) => {
    console.log('----------->', editMode);
    const { sliceStart: sstart, sliceEnd: send } = properties;
    setSliceStart(sstart || sliceStart || 0);
    setSliceEnd(send || sliceEnd || Infinity);
    setMode(isEditMode ? PLAYER_MODE.NORMAL : PLAYER_MODE.SLICE_EDIT);
  };

  const onQualityChange = quality => {
    if (quality === videoQuality) {
      return;
    }

    setWasCurrentTime(currentTime);
    playerHelper.persistPreferredVideoSize(quality);
    const { byQuality } = item;
    setVideoQuality(quality);
    setSource(byQuality[quality]);
  };

  // Remember the current time while switching.
  const switchAV = () => {
    setWasCurrentTime(currentTime);
    onSwitchAV();
  };

  // Remember the current time while switching.
  const languageChange = e => {
    setWasCurrentTime(currentTime);
    onLanguageChange(e, e.target?.value);
  };

  if (isEditMode) {

  }

  return (
    <Player ref={player} theme="dark" playsInline
      style={{ '--vm-control-spacing': 0, }}
      debug={true}
    >
      <VmProvider
        isVideo={isVideo}
        poster={isVideo ? item.preImageUrl : null}
        source={source}
      />
      <VmControls player={player.current}
        isVideo={isVideo}
        // TODO isMobile={isMobile}

        activeDuration={1500}
        hideWhenPaused={false}

        onSwitchAV={switchAV}
        onActivateSlice={() => {
          setEditMode();
        }}

        showNextPrev={showNextPrev}
        hasPrev={hasPrev}
        onPrev={onPrev}
        hasNext={hasNext}
        onNext={onNext}
      />
      {isEditMode && (
        <ShareFormDesktop
          // media={media}
          item={item}
          uiLanguage={uiLanguage}
          onSliceChange={this.handleSliceChange}
          onExit={() => {
            setMode(PLAYER_MODE.NORMAL);
            setSliceStart(undefined);
            setSliceEnd(undefined);
          }}
        />
      )}
      <VmSettings
        isVideo={isVideo}
        videoQuality={videoQuality}
        videoQualities={Object.keys(item.byQuality)}
        onQualityChange={onQualityChange}
        onSwitchAV={switchAV}
        selectedLanguage={selectedLanguage}
        languages={languages}
        onLanguageChange={languageChange}
      />
    </Player>
  );
};

VmPlayer.propTypes = {
  t: PropTypes.func.isRequired,

  uiLanguage: PropTypes.string.isRequired,
  chronicles: PropTypes.instanceOf(ClientChronicles),

  // Language dropdown props.
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  requestedLanguage: PropTypes.string,

  // Audio/Video switch props.
  item: shapes.VideoItem.isRequired,
  onSwitchAV: PropTypes.func.isRequired,

  // Slice props
  history: shapes.History.isRequired,

  // Playlist props
  autoPlay: PropTypes.bool,
  showNextPrev: PropTypes.bool,
  hasNext: PropTypes.bool,
  hasPrev: PropTypes.bool,
  onFinish: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,

  onMediaEditModeChange: PropTypes.func.isRequired,
  onDropdownOpenedChange: PropTypes.func.isRequired,

  // Player actions.
  actionPlayerPlay: PropTypes.func.isRequired,
};

export default withNamespaces()(VmPlayer);
