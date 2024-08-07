import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../../redux/modules/player';
import { stopBubbling } from '../../../../../helpers/utils';
import { PLAYER_OVER_MODES } from '../../../../../helpers/consts';
import { Button } from 'semantic-ui-react';
import React from 'react';
import PlaylistAddIcon from '../../../../../images/icons/PlaylistAdd';
import { playerGetOverModeSelector } from '../../../../../redux/selectors';

export const ToPlaylistBtn = () => {
  const { t } = useTranslation();
  const mode  = useSelector(playerGetOverModeSelector);

  const dispatch = useDispatch();

  const handleOpen = e => {
    stopBubbling(e);
    const newMode = (mode === PLAYER_OVER_MODES.playlist) ? PLAYER_OVER_MODES.none : PLAYER_OVER_MODES.playlist;
    dispatch(actions.setOverMode(newMode));
  };

  return (
    <Button
      basic
      className="my_playlist_add clear_button uppercase no-padding"
      onClick={handleOpen}
    >
      <PlaylistAddIcon className="playlist_add" fill="#767676"/>
      <span>{t('buttons.save')}</span>
    </Button>
  );
};
