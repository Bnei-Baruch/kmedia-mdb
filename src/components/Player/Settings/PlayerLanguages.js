import React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { LANGUAGE_OPTIONS, PLAYER_OVER_MODES } from '../../../helpers/consts';
import { actions as playlistActions, selectors as playlistSelectors } from '../../../redux/modules/playlist';
import { actions, selectors } from '../../../redux/modules/player';
import { withNamespaces } from 'react-i18next';

const PlayerLanguages = ({ t }) => {
  const { languages = [] } = useSelector(state => playlistSelectors.getPlayed(state.playlist));
  const { language }       = useSelector(state => selectors.getFile(state.player));
  const dispatch           = useDispatch();

  const handleSelect = (e, { name }) => dispatch(playlistActions.setLanguage(name));

  const handleCloseLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.settings));

  return (
    <div className="settings__pane">
      <Button inverted fluid onClick={handleCloseLangs}>
        <Icon name="left chevron" />
        {t('player.settings.language')}
      </Button>
      <Menu secondary vertical inverted size="small">
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
              )
            )
        }
      </Menu>
    </div>
  );
};

export default withNamespaces()(PlayerLanguages);