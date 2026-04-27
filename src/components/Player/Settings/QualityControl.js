import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { MT_AUDIO, VS_NAMES } from '../../../helpers/consts';
import { actions as playlistActions } from '../../../redux/modules/playlist';
import { playerGetFileSelector, playlistGetInfoSelector, playlistGetPlayedSelector } from '../../../redux/selectors';

const QualityControl = ({ t }) => {
  const { browserName } = useContext(DeviceInfoContext);

  const playedItem            = useSelector(playlistGetPlayedSelector);
  const { quality, language } = useSelector(playlistGetInfoSelector);
  const { type }              = useSelector(playerGetFileSelector);

  const dispatch = useDispatch();

  if (type === MT_AUDIO) return null;

  const qualities = !playedItem?.isHLS ? playedItem.qualityByLang?.[language] : playedItem.qualities;

  if (!qualities || qualities.length < 2 || (playedItem?.isHLS && browserName === 'Safari')) return null;

  const handleSetQuality = x => dispatch(playlistActions.setQuality(x));
  return (
    <div className="settings__row">
      <h5 className="small font-semibold">{t('player.settings.quality')}</h5>
      <div className="inline-flex">
        {
          qualities?.map((x, i) => (
            <button
              className={`px-2 py-1 text-xs border border-white/30 ${x === quality ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              onClick={() => handleSetQuality(x)}
              key={`${x}_${i}`}
            >
              {VS_NAMES[x]}
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default withTranslation()(QualityControl);
