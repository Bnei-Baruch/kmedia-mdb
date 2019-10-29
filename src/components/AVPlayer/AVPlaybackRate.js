import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

const options = [
  { value: '2x', text: '2x' },
  { value: '1.5x', text: '1.5x' },
  { value: '1.25x', text: '1.25x' },
  { value: '1x', text: '1x' },
  { value: '0.75x', text: '0.75x' }];

const AVPlaybackRate = ({ onSelect = noop, value = '1x', onDropdownOpenedChange }) => {

  const handleChange = (e, data) => onSelect(e, data.value);

  const handleOnOpen = () => onDropdownOpenedChange(true);

  const handleOnClose = () => onDropdownOpenedChange(false);

  return (
    <div className="mediaplayer__playback-rate">
      <Dropdown
        floating
        scrolling
        upward
        icon={null}
        selectOnBlur={false}
        options={options}
        value={value}
        onChange={handleChange}
        trigger={<button type="button">{value}</button>}
        onOpen={handleOnOpen}
        onClose={handleOnClose}
      />
    </div>
  );
};

AVPlaybackRate.propTypes = {
  onSelect: PropTypes.func,
  value: PropTypes.string,
  onDropdownOpenedChange: PropTypes.func.isRequired,
};

export default AVPlaybackRate;
