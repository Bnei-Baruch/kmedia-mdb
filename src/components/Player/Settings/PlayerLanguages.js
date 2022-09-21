import React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';

import { LANGUAGE_OPTIONS, JWPLAYER_ID, PLAYER_OVER_MODES } from '../../../helpers/consts';
import { useSelector, useDispatch } from 'react-redux';
import { actions as playlistActions, selectors as playlistSelectors } from '../../../redux/modules/playlist';
import { actions } from '../../../redux/modules/player';

const PlayerLanguages = ({ active }) => {
  const { languages } = useSelector(state => playlistSelectors.getPlayed(state.playlist));
  const dispatch      = useDispatch();

  const handleSelect = (e, { name }) => {
    dispatch(playlistActions.setLanguage(name));
    dispatch(actions.continuePlay(window.jwplayer(JWPLAYER_ID).getPosition()));
  };

  const handleCloseLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.settings));

  return (

    <div className="settings__pane">
      <Button inverted fluid onClick={handleCloseLangs}>
        <Icon name="left chevron" />
        Language
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
                  active={active === x.value}
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

export default PlayerLanguages;
