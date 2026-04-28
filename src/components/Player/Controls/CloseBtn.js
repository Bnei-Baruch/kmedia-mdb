import React from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';

const CloseBtn = ({ className }) => {
  const dispatch = useDispatch();

  const handleClose = e => {
    stopBubbling(e);
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <div className={className} onClick={handleClose}>
      <span className="material-symbols-outlined text-base">close</span>
    </div>
  );
};

export default CloseBtn;
