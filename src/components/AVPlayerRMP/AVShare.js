import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const AVShare = ({ onActivateSlice }) => (
  <button
    type="button"
    tabIndex="-1"
    className="player-button player-control-slice-share"
    onClick={onActivateSlice}
  >
    <Icon
      name="share alternate"
      style={{ margin: 0, height: '100%' }}
    />
  </button>
);


AVShare.propTypes = {
  onActivateSlice: PropTypes.func.isRequired,
};

export default AVShare;
