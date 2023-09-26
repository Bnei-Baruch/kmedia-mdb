import React, { useContext } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { withTranslation } from 'next-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { actions, selectors as player } from '../../redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES } from '../../../src/helpers/consts';
import QualityControl from './QualityControl';
import PlayerLanguages from './PlayerLanguages';
import MediaTypeControl from './MediaTypeControl';
import RateControl from './RateControl';
import CloseBtn from '../Controls/CloseBtn';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import SubsControl from './SubsControl';

const Settings = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const mode                      = useSelector(state => player.getOverMode(state.player));
  const dispatch                  = useDispatch();

  const handleOpenLangs = () => dispatch(actions.setOverMode(PLAYER_OVER_MODES.languages));

  return (
    <div className="settings">
      {
        mode !== PLAYER_OVER_MODES.languages && (
          <div className="settings__pane">
            {!isMobileDevice && <MediaTypeControl />}
            <SubsControl />
            <RateControl />
            <QualityControl />
            <div className="settings__row">
              <Header size="tiny">{t('player.settings.language')}</Header>
              <PlayerLanguages />
            </div>
          </div>
        )
      }
      {isMobileDevice && <CloseBtn className="settings__close" />}
      <div className="settings__pane"></div>
    </div>
  );
};

export default withTranslation()(Settings);
