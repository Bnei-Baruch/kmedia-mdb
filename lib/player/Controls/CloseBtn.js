import React from 'react';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'next-i18next';
import { Icon } from 'semantic-ui-react';

import { actions, playerSlice } from '../../redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES } from '../../../src/helpers/consts';
import { stopBubbling } from '../../../src/helpers/utils';

const CloseBtn = ({ className, t }) => {

  const dispatch = useDispatch();

  const handleClose = e => {
    stopBubbling(e);
    dispatch(playerSlice.actions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <div className={className} onClick={handleClose}>
      <Icon fitted name="close" />
    </div>
  );
};

export default withTranslation()(CloseBtn);
