import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { setPlaybackRate } from '../../../pkg/jwpAdapter/adapter';
import { playerGetFileSelector, playerGetRateSelector } from '../../../redux/selectors';

const PLAYER_SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const RateControl = () => {
  const { t } = useTranslation();
  const rate = useSelector(playerGetRateSelector);
  const file = useSelector(playerGetFileSelector);

  if (!file) return null;

  return (
    <div className="settings__row">
      <h5 className="small font-semibold">{t('player.settings.playback-speed')}</h5>
      <div className="settings__options">
        {
          PLAYER_SPEEDS.map(x => {
            const content = x !== 1 ? `${x}x` : t('player.settings.normal');
            return (
              <div
                className={`settings__option${x === rate ? ' active' : ''}`}
                onClick={() => setPlaybackRate(x)}
                key={x}
              >
                {content}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default RateControl;
