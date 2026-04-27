import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';
import { playerGetFileSelector, playlistGetPlayedSelector } from '../../../redux/selectors';

const MediaTypeControl = ({ t }) => {
  const { type, language }  = useSelector(playerGetFileSelector);
  const { isHLS, mtByLang } = useSelector(playlistGetPlayedSelector);

  const dispatch = useDispatch();

  const hasVideo = isHLS || mtByLang[language]?.length > 1;

  const handleSetMediaType = name => dispatch(playlistActions.setMediaType(name));

  return (
    <div className="settings__row">
      <h5 className="small font-semibold">{t('player.settings.playback')}</h5>
      <div className="inline-flex">
        {
          [MT_VIDEO, MT_AUDIO].map(mt => (
            <button
              onClick={() => handleSetMediaType(mt)}
              key={mt}
              className={`px-2 py-1 text-xs border border-white/30 ${type === mt ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              disabled={mt === MT_VIDEO && !hasVideo}
            >
              {t(`player.settings.${mt}`)}
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default withTranslation()(MediaTypeControl);
