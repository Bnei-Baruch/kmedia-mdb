import React, { useState, useRef, useContext } from 'react'

import { Form, Dropdown, Menu } from 'semantic-ui-react'
import { usePlayerContext, usePlayer } from '@vime/react';
import { LANGUAGE_OPTIONS } from '../../../helpers/consts';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const formatRate = rate => rate.toString() === '1' ? 'normal' : `${rate}x`;

const VmBBSettings = ({ item, isVideo, onSwitchAV, videoQuality, playbackRates, onQualityChange, onLanguageChange, onExit }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const ref = useRef(null);
  const player = usePlayer(ref);

  const [playbackRate, setPlaybackRate] = usePlayerContext(ref, 'playbackRate', 1);

  const videoQualities = Object.keys(item.byQuality);

  const [av, setAV] = useState(isVideo ? 'video' : 'audio');

  const options = LANGUAGE_OPTIONS
    .filter(x => item.availableLanguages.includes(x.value))
    .map(x => ({ value: x.value, text: x.name }));

  const handlePlaybackRateSwitch = (e, data) => {
    console.log('data:', data, playbackRates, player.canSetPlaybackRate())
    const rate = parseFloat(data.name);
    setPlaybackRate(rate);
    console.log('p', playbackRate, rate)
  };

  const handleVideoQuality = (e, { value }) => {
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

  // console.log('playbackRates:', playbackRates, playbackRate)

  return (
    <div ref={ref} className="mediaplayer__onscreen-settings">
      <Form inverted>
        <Form.Button icon="close" onClick={onExit}></Form.Button>
        <Form.Group inline>
          <label>Language</label>
          <Dropdown
            placeholder='Language'
            floating
            upward={!isMobileDevice}
            search
            selection
            options={options}
            onChange={handleLanguageChange}
            value={item.language}
          />
        </Form.Group>
        <Form.Group inline>
          <label>Playback Rate</label>
          <Menu color='black' inverted>
            {
              playbackRates.map(rate =>
                <Menu.Item
                  key={`rate ${  rate}`}
                  name={rate.toString()}
                  active={rate.toString() === playbackRate.toString()}
                  onClick={handlePlaybackRateSwitch}
                >
                  {formatRate(rate)}
                </Menu.Item>
              )
            }
          </Menu>
        </Form.Group>
        <Form.Group inline>
          <label>Quality</label>
          {
            videoQualities.map(quality =>
              <Form.Radio
                key={`quality-${quality}`}
                label={quality}
                value={quality}
                checked={quality === videoQuality}
                onChange={handleVideoQuality}
              />
            )
          }
        </Form.Group>
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
      </Form>
    </div>
  )
}

export default VmBBSettings;
