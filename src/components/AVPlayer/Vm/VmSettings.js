import React, { useRef } from 'react';
import { MenuItem, MenuRadio, MenuRadioGroup, Settings, Submenu, usePlayerContext } from '@vime/react';
import { LANGUAGE_OPTIONS, VS_FHD, VS_HD, VS_NAMES, VS_NHD } from '../../../helpers/consts';

const sortedVS = [VS_FHD, VS_HD, VS_NHD];

const formatRate = (rate) => rate.toString() === '1' ? 'normal' : `${rate}x`;

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

const onPlaybackQualitySelect = (event, callback, setPlaybackQuality) => {
  const radio = event.target.value;
  setPlaybackQuality(radio);
  callback(radio);
};

const buildPlaybackQualitySubmenu = (isVideo, videoQuality, setPlaybackQuality, videoQualities, onQualityChange) => {
  if (!isVideo) {
    return null;
  }
  if (videoQualities.length <= 1) {
    return <MenuItem label="Playback" hint={VS_NAMES[videoQuality] ?? 'auto'} />;
  }

  return (
    <Submenu label="Quality" hint={VS_NAMES[videoQuality]}>
      <MenuRadioGroup value={videoQuality} onVmCheck={(e) => onPlaybackQualitySelect(e, onQualityChange, setPlaybackQuality)}>
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

const buildLanguageMenu = (selectedLanguage, languages, onLanguageChange) => {
  const options = LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .sort((a, b) => {
      if (a.value < b.value) {
        return -1;
      }
      if (a.value > b.value) {
        return 1;
      }
      return 0;
    })
    .map(x => ({ value: x.value, text: x.value }));

  return (
    <Submenu label="Language" hint={selectedLanguage}>
      <MenuRadioGroup value={selectedLanguage} onVmCheck={onLanguageChange}>
        {
          options.map(language => (
            <MenuRadio key={`lang-${language.value}`} label={language.text} value={language.value} />
          ))
        }
      </MenuRadioGroup>
    </Submenu>
  );
};

export const VmSettings = ({ isVideo, videoQuality, videoQualities, onQualityChange, onSwitchAV, selectedLanguage, languages, onLanguageChange }) => {
  const ref = useRef(null);

  const [playbackRates]                 = usePlayerContext(ref, 'playbackRates', []);
  const [playbackRate, setPlaybackRate] = usePlayerContext(ref, 'playbackRate', 1);
  const [_, setPlaybackQuality]         = usePlayerContext(ref, 'playbackQuality', 'HD');

  const onPlaybackRateSelect = (event) => {
    const rate = parseFloat(event.target.value);
    setPlaybackRate(rate);
  };

  return (
    <>
      <Settings hideTooltip id="1" ref={ref}>
        {buildPlaybackRateSubmenu(playbackRates, playbackRate, onPlaybackRateSelect)}
        {buildPlaybackQualitySubmenu(isVideo, videoQuality, setPlaybackQuality, videoQualities, onQualityChange)}
        {buildAVSubmenu(isVideo, onSwitchAV)}
        {buildLanguageMenu(selectedLanguage, languages, onLanguageChange)}
      </Settings>
    </>
  );
};
