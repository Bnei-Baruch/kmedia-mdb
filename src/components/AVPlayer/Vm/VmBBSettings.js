import React, { useState, useRef } from 'react'
import { Form, Radio, Dropdown } from 'semantic-ui-react'
import { usePlayerContext } from '@vime/react';
import { LANGUAGE_OPTIONS } from '../../../helpers/consts';

const formatRate = rate => rate.toString() === '1' ? 'normal' : `${rate}x`;

const VmBBSettings = ({ item, isVideo, onSwitchAV, videoQuality, onQualityChange, onLanguageChange, onExit }) => {
  const ref = useRef(null);

  const [playbackRates]                 = usePlayerContext(ref, 'playbackRates', []);
  const [playbackRate, setPlaybackRate] = usePlayerContext(ref, 'playbackRate', 1);

  const videoQualities = Object.keys(item.byQuality);

  // const [playbackQualities]             = usePlayerContext(ref, 'playbackQualities');
  // const [playbackQuality, setPlaybackQuality] = usePlayerContext(ref, 'playbackQuality');

  const [av, setAV] = useState(isVideo ? 'video' : 'audio');

  const options = LANGUAGE_OPTIONS
    .filter(x => item.availableLanguages.includes(x.value))
    .map(x => ({ value: x.value, text: x.name }));

  const handlePlaybackRateSwitch = (e, { value }) => {
    const rate = parseFloat(value);
    setPlaybackRate(rate);
  };

  const handleVideoQuality = (e, { value }) => {
    // setPlaybackQuality(value);
    onQualityChange(value);
  }

  const handleAVSwitch = (e, { value }) => {
    setAV(value);
    onSwitchAV();
  }

  const handleLanguageChange = (e, { value }) => {
    console.log('handleLanguageChange:', value)
    onLanguageChange(value);
  }

  console.log('videoQualities:', videoQualities, 'current video quality:', videoQuality)

  return (
    <div ref={ref} className="mediaplayer__onscreen-settings">
      <Form>
        <Form.Button icon="close" onClick={onExit} className="mediaplayer__onscreen-settings-back"></Form.Button>
        <Form.Group inline>
          <label>Audio/Video</label>
          <Form.Radio
            label='Audio'
            value='audio'
            checked={av === 'audio'}
            onChange={handleAVSwitch}
          />
          <Form.Radio
            label='Video'
            value='video'
            checked={av === 'video'}
            onChange={handleAVSwitch}
          />
        </Form.Group>
        <Form.Group inline>
          <label>Playback Rate</label>
          {
            playbackRates.map(rate =>
              <Form.Radio
                key={`rate-${rate}`}
                label={formatRate(rate)}
                value={rate}
                checked={rate === playbackRate}
                onChange={handlePlaybackRateSwitch}
              />
            )
          }
        </Form.Group>
        <Form.Group inline>
          <label>Quality</label>
          {
            videoQualities.map(quality =>
              <Radio
                key={`quality-${quality}`}
                label={quality}
                value={quality}
                checked={quality === videoQuality}
                onChange={handleVideoQuality}
              />
            )
          }
        </Form.Group>
        <Dropdown
          placeholder='Language'
          // fluid
          search
          selection
          options={options}
          onChange={handleLanguageChange}
          value={item.language}
        />
      </Form>
    </div>
  )
}

export default VmBBSettings;
