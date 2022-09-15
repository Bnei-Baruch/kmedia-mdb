import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { JWPLAYER_ID } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';
import { actions as playlistActions } from '../../../redux/modules/playlist';
import { useDispatch } from 'react-redux';

const seek = (e, pos) => {
  const p = window.jwplayer(JWPLAYER_ID);
  p.seek(p.getPosition() + pos);
  stopBubbling(e);
};

export const PrevBtn = () => {
  const dispatch = useDispatch();

  const handlePrev = e => {
    dispatch(playlistActions.prev());
    stopBubbling(e);
  };

  return (
    <Popup content="Next video" inverted size="mini" position="top right" trigger={
      <div className="controls__next" onClick={handlePrev}>
        <Icon fitted size="big" name="forward" />
      </div>
    } />
  );
};

export const NextBtn = () => {
  const dispatch   = useDispatch();
  const handleNext = e => {
    dispatch(playlistActions.next());
    stopBubbling(e);
  };
  return (
    <Popup content="Next video" inverted size="mini" position="top right" trigger={
      <div className="controls__next" onClick={handleNext}>
        <Icon fitted size="big" name="forward" />
      </div>
    } />
  );
};
