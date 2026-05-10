import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import QualityControl from './QualityControl';
import PlayerLanguages from './PlayerLanguages';
import MediaTypeControl from './MediaTypeControl';
import RateControl from './RateControl';
import CloseBtn from '../Controls/CloseBtn';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import SubsControl from './SubsControl';
import { playerGetOverModeSelector } from '../../../redux/selectors';
import clsx from 'clsx';

const Settings = () => {
  const { t } = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const mode = useSelector(playerGetOverModeSelector);

  return (
    <div className="settings">
      {
        mode !== PLAYER_OVER_MODES.languages && (
          <div className={clsx("settings__pane", { "w-full": isMobileDevice })} >
            {!isMobileDevice && <MediaTypeControl />}
            <SubsControl />
            <RateControl />
            <QualityControl />
            <div className="settings__row">
              <h5 className="small font-semibold">{t('player.settings.language')}</h5>
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

export default Settings;
