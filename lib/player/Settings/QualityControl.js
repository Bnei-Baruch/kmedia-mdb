import React, { useContext } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { withTranslation } from 'next-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as playlist, actions as playlistActions } from '../../redux/slices/playlistSlice/playlistSlice';
import { selectors } from '../../redux/slices/playerSlice/playerSlice';
import { MT_AUDIO, VS_NAMES } from '../../../src/helpers/consts';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';

const QualityControl = ({ t }) => {
  const { deviceInfo } = useContext(DeviceInfoContext);

  const playedItem            = useSelector(state => playlist.getPlayed(state.playlist));
  const { quality, language } = useSelector(state => playlist.getInfo(state.playlist));
  const { type }              = useSelector(state => selectors.getFile(state.player));

  const dispatch = useDispatch();

  if (type === MT_AUDIO) return null;

  const qualities = !playedItem?.isHLS ? playedItem.qualityByLang?.[language] : playedItem.qualities;

  if (!qualities || qualities.length < 2 || (playedItem?.isHLS && deviceInfo.browser.name === 'Safari')) return null;

  const handleSetQuality = x => dispatch(playlistActions.setQuality(x));
  return (
    <div className="settings__row">
      <Header size="tiny">{t('player.settings.quality')}</Header>
      <Button.Group size="mini" inverted>
        {
          qualities?.map((x, i) => (
            <Button
              inverted
              content={VS_NAMES[x]}
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