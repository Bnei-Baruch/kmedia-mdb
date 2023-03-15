import React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { LANGUAGE_OPTIONS, PLAYER_OVER_MODES } from '../../../helpers/consts';
import { actions as playlistActions, selectors as playlist } from '../../../redux/modules/playlist';
import { actions } from '../../../redux/modules/player';
import { useTranslation } from 'react-i18next';

const PlayerLanguages = ({ language }) => {
  const { languages = [] } = useSelector(state => playlist.getPlayed(state.playlist));
  const dispatch           = useDispatch();
  const { t }              = useTranslation();

  const handleSelect = (e, { name }) => dispatch(playlistActions.setLanguage(name));

  const handleCloseLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.settings));

  return (
    <div className="settings__pane">
      <Button inverted fluid onClick={handleCloseLangs}>
        <Icon name="left chevron" />
        {t('player.settings.language')}
      </Button>
      <Menu secondary vertical inverted size="small" fluid>
        {
          LANGUAGE_OPTIONS
            .filter(x => languages.includes(x.value))
            .map(x => (
              <Menu.Item
                link
                name={x.value}
                content={x.name}
                active={language === x.value}
                onClick={handleSelect}
                key={x.value}
              />
            ))
        }
      </Menu>
    </div>
  );
};

export default PlayerLanguages;
