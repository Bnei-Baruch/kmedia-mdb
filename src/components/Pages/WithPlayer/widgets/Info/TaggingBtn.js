import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/player';
import { stopBubbling } from '../../../../../helpers/utils';
import { PLAYER_OVER_MODES } from '../../../../../helpers/consts';
import { Button } from 'semantic-ui-react';
import { SectionLogo } from '../../../../../helpers/images';
import React from 'react';
import { playerGetOverModeSelector } from '../../../../../redux/selectors';

export const TaggingBtn = () => {
  const { t } = useTranslation();
  const mode  = useSelector(playerGetOverModeSelector);

  const dispatch = useDispatch();

  const handleOpen = e => {
    stopBubbling(e);
    const newMode = (mode === PLAYER_OVER_MODES.tagging) ? PLAYER_OVER_MODES.none : PLAYER_OVER_MODES.tagging;
    dispatch(actions.setOverMode(newMode));
  };

  return (
    <Button
      basic
      className="clear_button my_tag"
      onClick={handleOpen}
    >
      <SectionLogo name="topics" color="grey" width="20" height="20"/>
      <span>{t('personal.label.tagging')}</span>
    </Button>
  );
};
