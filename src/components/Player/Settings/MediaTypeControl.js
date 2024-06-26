import React from 'react';
import { Button, Header } from 'semantic-ui-react';
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

  const handleSetMediaType = (e, { name }) => dispatch(playlistActions.setMediaType(name));

  return (
    <div className="settings__row">
      <Header size="tiny">{t('player.settings.playback')}</Header>
      <Button.Group size="mini" inverted>
        {
          [MT_VIDEO, MT_AUDIO].map(mt => (
            <Button

              inverted
              onClick={handleSetMediaType}
              name={mt}
              key={mt}
              content={t(`player.settings.${mt}`)}
              active={type === mt}
              disabled={mt === MT_VIDEO && !hasVideo}
            />
          ))
        }
      </Button.Group>
    </div>
  );
};

export default withTranslation()(MediaTypeControl);
