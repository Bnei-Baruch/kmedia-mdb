import React, { useRef } from 'react';
import { MenuItem, MenuRadio, MenuRadioGroup, Settings, Submenu, usePlayerContext } from '@vime/react';
import { LANGUAGE_OPTIONS, VS_NAMES } from '../../../helpers/consts';

const formatRate = rate => rate.toString() === '1' ? 'normal' : `${rate}x`;

const sortByValue = (a, b) =>
  a.value < b.value
    ? -1
    : a.value > b.value
      ? 1
      : 0;

const buildPlaybackRateSubmenu = (playbackRates, currentRate, playback) => (
  <Submenu label="Playback Rate" hint={formatRate(currentRate)}>
    <MenuRadioGroup value={currentRate.toString()} onVmCheck={playback}>
      {
        playbackRates.map(rate =>
          <MenuRadio key={`rate-${rate}`} label={formatRate(rate)} value={rate} />
        )
      }
    </MenuRadioGroup>
  </Submenu>
);

const buildPlaybackQualitySubmenu = (isVideo, videoQuality, videoQualities, onQualityChange) => {
  if (!isVideo) {
    return null;
  }

  if (videoQualities.length <= 1) {
    return <MenuItem label="Playback" hint={VS_NAMES[videoQuality] ?? 'auto'} />;
  }

  return (
    <Submenu label="Quality" hint={VS_NAMES[videoQuality]}>
      <MenuRadioGroup value={videoQuality} onVmCheck={e => onQualityChange(e.target.value)}>
        {
          videoQualities.map(quality => (
            <MenuRadio key={`quality-${quality}`} label={VS_NAMES[quality]} value={quality} />
          ))
        }
      </MenuRadioGroup>
    </Submenu>
  );
};

const buildAVSubmenu = (isVideo, onSwitchAV) => {
  const state = isVideo ? 'video' : 'audio';
  return (
    <Submenu label="Audio/Video" hint={state}>
      <MenuRadioGroup value={state} onVmCheck={onSwitchAV}>
        <MenuRadio key={'audio'} label={'audio'} value={'audio'} />
        <MenuRadio key={'video'} label={'video'} value={'video'} />
      </MenuRadioGroup>
    </Submenu>
  );
};

const buildLanguageMenu = (selectedLanguage, languages, onLanguageChange) => (
  <Submenu label="Language" hint={selectedLanguage}>
    <MenuRadioGroup value={selectedLanguage} onVmCheck={onLanguageChange}>
      {
        LANGUAGE_OPTIONS
          .filter(lang => languages.includes(lang.value))
          .sort(sortByValue)
          .map(lang => <MenuRadio key={`lang-${lang.value}`} label={lang.name} value={lang.value} />)

      }
    </MenuRadioGroup>
  </Submenu>
);

export const VmSettings = ({ isVideo, videoQuality, videoQualities, onQualityChange, onSwitchAV, selectedLanguage, languages, onLanguageChange }) => {
  const ref = useRef(null);

  const [playbackRates]                 = usePlayerContext(ref, 'playbackRates', []);
  const [playbackRate, setPlaybackRate] = usePlayerContext(ref, 'playbackRate', 1);

  const onPlaybackRateSelect = event => {
    const rate = parseFloat(event.target.value);
    setPlaybackRate(rate);
  };

  return (
    <Settings hideTooltip id="1" ref={ref}>
      {buildPlaybackRateSubmenu(playbackRates, playbackRate, onPlaybackRateSelect)}
      {buildPlaybackQualitySubmenu(isVideo, videoQuality, videoQualities, onQualityChange)}
      {buildAVSubmenu(isVideo, onSwitchAV)}
      {buildLanguageMenu(selectedLanguage, languages, onLanguageChange)}
    </Settings>
  );
};
