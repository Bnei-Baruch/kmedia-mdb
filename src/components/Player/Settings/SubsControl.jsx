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
      <div className="settings__options">
        {
          ['off', ...subtitles.map(x => x.language)].map(l => (
            <div
              className={`settings__option${l === subsLanguage ? ' active' : ''}`}
              onClick={() => handleSetSubtitlesLang(l)}
              key={l}
            >
              {l}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default SubsControl;
