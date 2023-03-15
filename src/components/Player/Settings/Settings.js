import React, { useContext } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { actions, selectors as player } from '../../../redux/modules/player';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { LANGUAGES, PLAYER_OVER_MODES } from '../../../helpers/consts';
import PlayerLanguages from './PlayerLanguages';
import QualityControl from './QualityControl';
import MediaTypeControl from './MediaTypeControl';
import RateControl from './RateControl';
import CloseBtn from '../Controls/CloseBtn';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const Settings = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { languages = [], isHLS } = useSelector(state => playlist.getPlayed(state.playlist));
  let { language }                = useSelector(state => playlist.getInfo(state.playlist));
  const file                      = useSelector(state => player.getFile(state.player));
  const mode                      = useSelector(state => player.getOverMode(state.player));
  const dispatch                  = useDispatch();

  if (!isHLS) {
    language = file.language;
  } else if (!languages.includes(language)) {
    language = languages[0];
  }
  const handleOpenLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.languages));

  return (
    <div className="settings">
      <CloseBtn className="settings__close" />
      {
        mode !== PLAYER_OVER_MODES.languages && (
          <div className="settings__pane">
            {!isMobileDevice && <MediaTypeControl />}
            <RateControl />
            {!isMobileDevice && <QualityControl />}
            <div className="settings__row">
              <Header size="tiny">{t('player.settings.language')}</Header>
              <Button.Group size="mini" inverted>
                <Button inverted onClick={handleOpenLangs}>
                  {LANGUAGES[language]?.name}
                  <Icon name="right chevron" />
                </Button>
              </Button.Group>
            </div>
          </div>
        )
      }
      <PlayerLanguages language={language} />
    </div>
  );
};

export default withTranslation()(Settings);
