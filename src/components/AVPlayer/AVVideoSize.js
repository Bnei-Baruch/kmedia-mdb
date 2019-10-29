import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';
import { VS_DEFAULT, VS_FHD, VS_HD, VS_NAMES, VS_NHD } from '../../helpers/consts';

const sortedVS = [VS_FHD, VS_HD, VS_NHD];

const AVVideoSize = ({value = VS_DEFAULT, qualities = [], onSelect = noop}) => {
  const handleChange = (e, data) => onSelect(e, data.value);

  if (qualities.length < 2 && qualities[0] === VS_DEFAULT) {
    return null;
  }

  const options = sortedVS
    .filter(x => qualities.includes(x))
    .map(x => ({ value: x, text: VS_NAMES[x] }));

  return (
    <div className="mediaplayer__video-size">
      <Dropdown
        floating
        scrolling
        upward
        disabled={qualities.length === 1}
        icon={null}
        selectOnBlur={false}
        options={options}
        value={value}
        onChange={handleChange}
        trigger={<button type="button">{VS_NAMES[value]}</button>}
      />
    </div>
  );
};

AVVideoSize.propTypes = {
  value: PropTypes.string,
  qualities: PropTypes.arrayOf(PropTypes.string),
  onSelect: PropTypes.func,
};

export default AVVideoSize;
