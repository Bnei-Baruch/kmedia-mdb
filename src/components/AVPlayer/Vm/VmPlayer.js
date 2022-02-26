import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { Player, usePlayerContext, Ui, Controls } from '@vime/react';

import * as shapes from '../../shapes';
import { DeviceInfoContext, ClientChroniclesContext } from '../../../helpers/app-contexts';
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
import VmBBSettings from './VmBBSettings';

// Default theme. ~960B
import '@vime/core/themes/default.css';

// import { setMode } from '@vime/core/dist/types/stencil-public-runtime';
// Optional light theme (extends default). ~400B
// import '@vime/core/themes/light.css';

const chooseSource = (item, t) => {
  if (isEmpty(item.byQuality)) {
    return { error: true, errorReason: t('messages.no-playable-files') };
  }

  let restoredVideoQuality = playerHelper.restorePreferredVideoSize();
  let file      = item.byQuality[restoredVideoQuality];

  console.log('chooseSource:', item, ' file:', file, ' restore videoSize:', restoredVideoQuality)

  // if we can't find the user preferred video size we fallback.
  // first we try to go down from where he was.
  // if we can't find anything on our way down we start go up.
  if (!file) {
    const vss = [VS_NHD, VS_HD, VS_FHD];
    const idx = vss.indexOf(restoredVideoQuality);
    const o   = vss.slice(0, idx).reverse().concat(vss.slice(idx + 1));
    restoredVideoQuality = o.find(x => !!item.byQuality[x]);
    file      = item.byQuality[restoredVideoQuality];
  }

  return { file, restoredVideoQuality };
};


const VmPlayer = ({
  item,
  autoPlay,
  onMediaEditModeChange,
  showNextPrev = false,
  onPrev = null,
  onNext = null,
  t,
}) => {
  // const chronicles         = useContext(ClientChroniclesContext);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const ref = useRef(null);

  const [duration]                    = usePlayerContext(ref, 'duration', 0);
  const [currentTime, setCurrentTime] = usePlayerContext(ref, 'currentTime', 0);
  const [playbackReady]               = usePlayerContext(ref, 'playbackReady', false);
  // const [mediaType]                   = usePlayerContext(player, 'mediaType', undefined);

  // const [playbackQualities]             = usePlayerContext(player, 'playbackQualities');
  const [playbackRates]                 = usePlayerContext(ref, 'playbackRates', [1]);
  // const [playbackRate, setPlaybackRate] = usePlayerContext(ref, 'playbackRate', 1);

  const [source, setSource]             = useState({});
  const [isVideo, setIsVideo]           = useState(item.mediaType === MT_VIDEO);
  const [videoQuality, setVideoQuality] = useState(VS_DEFAULT);
  const [switchCurrentTime, setSwitchCurrentTime] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);

  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd]     = useState(ref.duration);

  const history = useHistory();
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
    const { file, restoredVideoQuality } = chooseSource(item, t);

    setVideoQuality(restoredVideoQuality);
    setSource(file?.src);
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
    onMediaEditModeChange(editMode ? PLAYER_MODE.SLICE_EDIT : PLAYER_MODE.NORMAL)
  }, [editMode, onMediaEditModeChange]);

  useEffect(() => {
    if (sliceStart) {
      console.log('setCurrentTime:', sliceStart)
      setCurrentTime(sliceStart);
    }
  }, [setCurrentTime, sliceStart])

  useEffect(() => {
    if (ref.current.playing && currentTime >= sliceEnd) {
      ref.current.pause();
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

    console.log('onQualityChange to', quality, item)
    playerHelper.persistPreferredVideoSize(quality);
    const file = item.byQuality[quality];

    setSwitchCurrentTime(currentTime);
    setVideoQuality(quality);
    setSource(file.src);
  };

  // Remember the current time while switching.
  const switchAV = () => {
    setSwitchCurrentTime(currentTime);
    playerHelper.switchAV(item, history);
  };

  // Remember the current time while switching.
  const handleLanguageChange = lang => {
    setSwitchCurrentTime(currentTime);
    playerHelper.setLanguageInQuery(history, lang);
  };

  return (
    <Player ref={ref}
      playsInline={true}
      // theme="dark"
      icons="material"
      autoPlay={autoPlay}
      debug={true}
    >
      <VmProvider
        isVideo={isVideo}
        poster={item.preImageUrl}
        source={source}
      />
      <Ui>
        <VmControls
          isVideo={isVideo}
          onSwitchAV={switchAV}
          onActivateSlice={() => setEditMode(!editMode)}
          onActivateSettings={() => setSettingsMode(!settingsMode)}
          sliceStart={sliceStart}
          sliceEnd={sliceEnd}
          duration={duration}
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
        { settingsMode &&
          <Controls pin='bottomRight' fullWidth fullHeight={isMobileDevice} justify='space-evenly'>
            <VmBBSettings
              item={item}
              isVideo={isVideo}
              videoQuality={videoQuality}
              playbackRates={playbackRates}
              onQualityChange={onQualityChange}
              onSwitchAV={switchAV}
              onLanguageChange={handleLanguageChange}
              onExit={() => setSettingsMode(false)}
            />
          </Controls>
        }
      </Ui>
    </Player>
  );
};

VmPlayer.propTypes = {
  t: PropTypes.func.isRequired,
  item: shapes.VideoItem.isRequired,

  // Playlist props
  autoPlay: PropTypes.bool,
  showNextPrev: PropTypes.bool,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onFinish: PropTypes.func,

  onMediaEditModeChange: PropTypes.func.isRequired,
  onDropdownOpenedChange: PropTypes.func.isRequired,
};

export default withNamespaces()(VmPlayer);
