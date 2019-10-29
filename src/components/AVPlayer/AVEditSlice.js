import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const AVEditSlice = ({onActivateSlice}) => (
  <button
    type="button"
    tabIndex="-1"
    className="player-button player-control-edit-slice"
    onClick={onActivateSlice}
  >
    <Icon name="share alternate" />
  </button>
);

AVEditSlice.propTypes = {
  onActivateSlice: PropTypes.func.isRequired,
};

export default AVEditSlice;
