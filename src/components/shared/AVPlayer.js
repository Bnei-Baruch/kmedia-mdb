import React from 'react';
import PropTypes from 'prop-types';
import JWPlayer from 'react-jw-player';

const AVPlayer = props => (
  <JWPlayer
    playerId={props.playerId}
    playerScript="https://content.jwplatform.com/libraries/mxNkRalL.js"
    customProps={{ skin: { name: 'seven' }, aspectratio: '16:9', width: '100%' }}
    {...props}
  />
);

AVPlayer.propTypes = {
  playerId: PropTypes.string.isRequired,
};

export default AVPlayer;
