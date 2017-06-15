import React from 'react';

import * as shapes from '../shapes';
import ReactJWPlayer from '../ReactJWPlayer/ReactJWPlayer';

const AVPlayer = ({ file }) => {
  const ext = file.name.substring(file.name.lastIndexOf('.'));

  return (<ReactJWPlayer
    playerId="video"
    playerScript="https://content.jwplatform.com/libraries/mxNkRalL.js"
    file={`http://cdn.kabbalahmedia.info/${file.id}${ext}`}
    image=""
    customProps={{ skin: { name: 'seven' }, aspectratio:'16:9', width: '100%' }}
  />);
};

AVPlayer.propTypes = {
  file: shapes.MDBFile.isRequired,
};

export default AVPlayer;
