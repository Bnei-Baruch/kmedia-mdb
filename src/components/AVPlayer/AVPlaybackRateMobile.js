import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

const options = [
  { value: '2x', text: '2x' },
  { value: '1.5x', text: '1.5x' },
  { value: '1.25x', text: '1.25x' },
  { value: '1x', text: '1x' },
  { value: '0.75x', text: '0.75x' }];

const AVPlaybackRateMobile = ({ onSelect = noop, value = '1x' }) => {

  const handleChange = e => onSelect(e, e.currentTarget.value);

  return (
    <div className="mediaplayer__playback-rate">
      <select value={value} onChange={handleChange}>
        {
          options.map(x => (
            <option key={x.value} value={x.value}>
              {x.text}
            </option>
          ))
        }
      </select>
    </div>
  );
};

AVPlaybackRateMobile.propTypes = {
  onSelect: PropTypes.func,
  value: PropTypes.string,
};

export default AVPlaybackRateMobile;
