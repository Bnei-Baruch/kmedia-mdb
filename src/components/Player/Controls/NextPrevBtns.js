import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import { actions as playlistActions } from '../../../redux/modules/playlist';

export const PrevBtn = () => {
  const dispatch = useDispatch();

  const handlePrev = () => dispatch(playlistActions.prev());

  return (
    <Popup content="Previous video" inverted size="mini" position="top left" trigger={
      <div className="controls__prev" onClick={handlePrev}>
        <Icon fitted size="big" name="backward" />
      </div>
    } />
  );
};

export const NextBtn = () => {
  const dispatch   = useDispatch();
  const handleNext = () => dispatch(playlistActions.next());

  return (
    <Popup content="Next video" inverted size="mini" position="top right" trigger={
      <div className="controls__next" onClick={handleNext}>
        <Icon fitted size="big" name="forward" />
      </div>
    } />
  );
};
