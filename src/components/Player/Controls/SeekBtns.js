import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';

const seek = (e, pos) => {
  const p = window.jwplayer(JWPLAYER_ID);
  p.seek(p.getPosition() + pos);
  stopBubbling(e);
};

export const SeekBackwardBtn = () => {

  const handleSeekBackward = e => seek(e, -10);
  return (
    <Popup content="Rewind 10 seconds" inverted size="mini" position="top center" trigger={
      <div className="controls__rewind" onClick={handleSeekBackward}>
        <Icon fitted size="big" name="undo" />
      </div>
    } />);
};

export const SeekForwardBtn = () => {

  const handleSeekForward = e => seek(e, 10);
  return (
    <Popup content="Skip 10 seconds" inverted size="mini" position="top center" trigger={
      <div className="controls__forward" onClick={handleSeekForward}>
        <Icon fitted size="big" name="redo" />
      </div>
    } />
  );
};
