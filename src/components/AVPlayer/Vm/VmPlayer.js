import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { Player, usePlayerContext, Ui, Controls } from '@vime/react';

import * as shapes from '../../shapes';
import ClientChronicles from '../../../helpers/clientChronicles';
import playerHelper from '../../../helpers/player';
import { isEmpty } from '../../../helpers/utils';
import { MT_VIDEO, VS_DEFAULT, VS_FHD, VS_HD, VS_NHD } from '../../../helpers/consts';
import { getQuery } from '../../../helpers/url';
import { fromHumanReadableTime } from '../../../helpers/time';
// import { selectors as settings } from '../../../redux/modules/settings';
import { PLAYER_MODE } from '../constants';
import ShareForm from '../Share/ShareForm';

import { VmControls } from './VmControls';
import { VmProvider } from './VmProvider';
import { VmSettings } from './VmSettings';

// Default theme. ~960B
import '@vime/core/themes/default.css';

// import { setMode } from '@vime/core/dist/types/stencil-public-runtime';
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
  onMediaEditModeChange,

  selectedLanguage,
  languages,
  onLanguageChange,

  showNextPrev = false,
  onPrev = null,
  onNext = null,
  t,
}) => {
  const player = useRef(null);
  // const uiLanguage          = useSelector(state => settings.getLanguage(state.settings));
  // const contentLanguage     = useSelector(state => settings.getContentLanguage(state.settings));

  const [duration]                    = usePlayerContext(player, 'duration', 0);
  const [currentTime, setCurrentTime] = usePlayerContext(player, 'currentTime', 0);
  const [playbackReady]               = usePlayerContext(player, 'playbackReady', false);
  // const [mediaType]                   = usePlayerContext(player, 'mediaType', undefined);

  const [source, setSource]             = useState({});
  const [isVideo, setIsVideo]           = useState(item.mediaType === MT_VIDEO);
  const [videoQuality, setVideoQuality] = useState(VS_DEFAULT);
  const [switchCurrentTime, setSwitchCurrentTime] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd]     = useState(player.duration);

  const location = useLocation();

  useEffect(() => {
    const query = getQuery(location);
    const { sstart, send } = query
    console.log('sstart, send:', sstart, send)

    if (sstart)
      setSliceStart(fromHumanReadableTime(sstart).asSeconds());

    if (send)
      setSliceEnd(fromHumanReadableTime(send).asSeconds())

  }, [location]);

  useEffect(() => {
    const { src, videoQuality } = chooseSource(item, t);
    setVideoQuality(videoQuality);
    setSource(src);
    setIsVideo(item.mediaType === MT_VIDEO);
  }, [item, t]);

  useEffect(() => {
    if (playbackReady && switchCurrentTime > 0) {
      console.log('setCurrentTime by switch time:', switchCurrentTime)
      setCurrentTime(switchCurrentTime);
      setSwitchCurrentTime(0);
    }
  }, [playbackReady, setCurrentTime, switchCurrentTime]);

  useEffect(() => {
    // if (!editMode && (sliceStart || sliceEnd)) {
    //   setSliceStart(undefined);
    //   setSliceEnd(undefined);
    // }

    onMediaEditModeChange(editMode ? PLAYER_MODE.SLICE_EDIT : PLAYER_MODE.NORMAL)
  }, [editMode, onMediaEditModeChange]);

  useEffect(() => {
    if (sliceStart) {
      console.log('setCurrentTime:', sliceStart)
      setCurrentTime(sliceStart);
    }
  }, [setCurrentTime, sliceStart])

  useEffect(() => {
    // console.log('currentTime, sliceEnd:', currentTime, sliceEnd)
    if (player.current.playing && currentTime >= sliceEnd) {
      console.log('pause')
      player.current.pause();
    }
  }, [currentTime, sliceEnd]);


  const handleSliceChange = (sliceStart, sliceEnd) => {
    console.log('handleSliceChange:', sliceStart, sliceEnd);
    setSliceStart(sliceStart);
    setSliceEnd(sliceEnd);
  }

  const onQualityChange = quality => {
    if (quality === videoQuality) {
      return;
    }

    setSwitchCurrentTime(currentTime);
    playerHelper.persistPreferredVideoSize(quality);
    const { byQuality } = item;
    setVideoQuality(quality);
    setSource(byQuality[quality]);
  };

  // Remember the current time while switching.
  const switchAV = () => {
    setSwitchCurrentTime(currentTime);
    onSwitchAV();
  };

  // Remember the current time while switching.
  const languageChange = e => {
    setSwitchCurrentTime(currentTime);
    onLanguageChange(e, e.target?.value);
  };

  return (
    <Player ref={player} theme="dark" playsInline autoPlay
      style={{ '--vm-control-spacing': 0, }}
      debug={true}
    >
      <VmProvider
        isVideo={isVideo}
        poster={isVideo ? item.preImageUrl : null}
        source={source}
      />
      <Ui>
        <VmControls
          isVideo={isVideo}
          onSwitchAV={switchAV}
          onActivateSlice={() => setEditMode(!editMode)}
          sliceStart={sliceStart}
          sliceEnd={sliceEnd}

          showNextPrev={showNextPrev}
          onPrev={onPrev}
          onNext={onNext}
        />
        { editMode &&
          <Controls pin="topLeft">
            <ShareForm
              item={item}
              currentTime={currentTime}
              duration={duration}
              onSliceChange={handleSliceChange}
              onExit={() => setEditMode(false)}
            />
          </Controls>
        }
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
      </Ui>
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
  // history: shapes.History.isRequired,

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
  // actionPlayerPlay: PropTypes.func.isRequired,
};

export default withNamespaces()(VmPlayer);
