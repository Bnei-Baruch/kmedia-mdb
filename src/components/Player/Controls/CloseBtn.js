import React from 'react';
import { useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Icon } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { stopBubbling } from '../../../helpers/utils';

const CloseBtn = ({ className, t }) => {

  const dispatch = useDispatch();

  const handleClose = e => {
    stopBubbling(e);
    dispatch(actions.setOverMode(PLAYER_OVER_MODES.none));
  };

  return (
    <div className={className} onClick={handleClose}>
      <Icon fitted name="close" />
    </div>
  );
};

export default withTranslation()(CloseBtn);
