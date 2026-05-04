import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';
import { playerGetFileSelector, playlistGetPlayedSelector } from '../../../redux/selectors';

const MediaTypeControl = () => {
  const { t } = useTranslation();
  const { type, language }  = useSelector(playerGetFileSelector);
  const { isHLS, mtByLang } = useSelector(playlistGetPlayedSelector);

  const dispatch = useDispatch();

  const hasVideo = isHLS || mtByLang[language]?.length > 1;

  const handleSetMediaType = name => dispatch(playlistActions.setMediaType(name));

  return (
    <div className="settings__row">
      <h5 className="small font-semibold">{t('player.settings.playback')}</h5>
      <div className="settings__options">
        {
          [MT_VIDEO, MT_AUDIO].map(mt => (
            <div
              onClick={() => !(mt === MT_VIDEO && !hasVideo) && handleSetMediaType(mt)}
              key={mt}
              className={`settings__option${type === mt ? ' active' : ''}${mt === MT_VIDEO && !hasVideo ? ' disabled' : ''}`}
            >
              {t(`player.settings.${mt}`)}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MediaTypeControl;
