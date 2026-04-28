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
      <div className="inline-flex">
        {
          PLAYER_SPEEDS.map(x => {
            const content = x !== 1 ? `${x}x` : t('player.settings.normal');
            return (
              <button
                className={`px-2 py-1 text-xs border border-white/30 ${x === rate ? 'bg-white text-black' : 'bg-transparent text-white'}`}
                onClick={() => setPlaybackRate(x)}
                key={x}
              >
                {content}
              </button>
            );
          })
        }
      </div>
    </div>
  );
};

export default RateControl;
