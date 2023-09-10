import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as playlist, actions } from '../../../redux/modules/playlist';
import { useTranslation } from 'next-i18next';
import { isEmpty } from '../../../helpers/utils';

const SubsControl = () => {
  const { subtitles } = useSelector(state => playlist.getPlayed(state.playlist));
  const subsLanguage  = useSelector(state => playlist.getInfo(state.playlist).subsLanguage);
  const { t }         = useTranslation();

  const dispatch = useDispatch();

  if (isEmpty(subtitles)) return null;
  const handleSetSubtitlesLang = l => dispatch(actions.setSubsLanguage(l));

  return (
    <div className="settings__row">
      <Header size="tiny">{t('player.settings.subtitles')}</Header>
      <Button.Group size="mini" inverted>
        {
          ['off', ...subtitles.map(x => x.language)].map(l => {
            return (
              <Button
                inverted
                content={l}
                onClick={() => handleSetSubtitlesLang(l)}
                active={l === subsLanguage}
                key={l}
              />
            );
          })
        }
      </Button.Group>
    </div>
  );
};

export default SubsControl;
