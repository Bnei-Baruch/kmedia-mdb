import { Button, Header, Icon } from 'semantic-ui-react';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../../../redux/modules/player';
import PlayerLanguages from './PlayerLanguages';
import { LANGUAGES, PLAYER_OVER_MODES } from '../../../helpers/consts';
import QualityControl from './QualityControl';
import MediaTypeControl from './MediaTypeControl';
import RateControl from './RateControl';

const Settings = () => {
  const file = useSelector(state => selectors.getFile(state.player));

  const dispatch = useDispatch();

  const handleOpenLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.languages));

  return (
    <div className="settings">
      <div className="settings__pane">
        <MediaTypeControl />
        <RateControl />
        <QualityControl />
        <div className="settings__row">
          <Header size="tiny">Language</Header>
          <Button.Group size="mini" inverted>
            <Button inverted onClick={handleOpenLangs}>
              {LANGUAGES[file.language]?.name}
              <Icon name="right chevron" />
            </Button>
          </Button.Group>
        </div>
      </div>
      <PlayerLanguages />
    </div>
  );
};

export default Settings;
