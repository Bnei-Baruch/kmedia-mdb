import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'next-i18next';

import { selectors } from '../../redux/slices/playerSlice/playerSlice';
import { playlistSlice, selectors as playlist } from '../../redux/slices/playlistSlice/playlistSlice';
import { MT_VIDEO, MT_AUDIO } from '../../../src/helpers/consts';

const MediaTypeControl = ({ t }) => {
  const { type, language }  = useSelector(state => selectors.getFile(state.player));
  const { isHLS, mtByLang } = useSelector(state => playlist.getPlayed(state.playlist));

  const dispatch = useDispatch();

  const hasVideo = isHLS || mtByLang[language]?.length > 1;

  const handleSetMediaType = (e, { name }) => dispatch(playlistSlice.actions.setMediaType(name));

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
