import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../redux/modules/playlist';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../../../helpers/utils';
import { playlistGetInfoSelector, playlistGetPlayedSelector } from '../../../redux/selectors';

const SubsControl = () => {
  const { subtitles }    = useSelector(playlistGetPlayedSelector);
  const { subsLanguage } = useSelector(playlistGetInfoSelector);
  const { t }            = useTranslation();

  const dispatch = useDispatch();

  if (isEmpty(subtitles)) return null;
  const handleSetSubtitlesLang = l => dispatch(actions.setSubsLanguage(l));

  return (
    <div className="settings__row">
      <h5 className="small font-semibold">{t('player.settings.subtitles')}</h5>
      <div className="inline-flex">
        {
          ['off', ...subtitles.map(x => x.language)].map(l => (
            <button
              className={`px-2 py-1 text-xs border border-white/30 ${l === subsLanguage ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              onClick={() => handleSetSubtitlesLang(l)}
              key={l}
            >
              {l}
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default SubsControl;
