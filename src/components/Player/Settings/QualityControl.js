import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as playlist, actions as playlistActions } from '../../../redux/modules/playlist';
import { selectors } from '../../../redux/modules/player';
import { MT_AUDIO } from '../../../helpers/consts';

const QualityControl = ({ t }) => {
  const playedItem            = useSelector(state => playlist.getPlayed(state.playlist));
  const { quality, language } = useSelector(state => playlist.getInfo(state.playlist));
  const { type }              = useSelector(state => selectors.getFile(state.player));

  const dispatch = useDispatch();

  if (type === MT_AUDIO) return null;

  const qualities = !playedItem.isHLS ? playedItem.qualityByLang?.[language] : playedItem.video_qualities;

  if (!qualities || qualities.length < 2) return null;

  const handleSetQuality = x => dispatch(playlistActions.setQuality(x));
  return (
    <div className="settings__row">
      <Header size="tiny">{t('player.settings.quality')}</Header>
      <Button.Group size="mini" inverted>
        {
          qualities?.map((x, i) => (
            <Button
              inverted
              content={x}
              onClick={() => handleSetQuality(x)}
              active={x === quality}
              key={`${x}_${i}`}
            />
          ))
        }
      </Button.Group>
    </div>
  );
};

export default withTranslation()(QualityControl);
