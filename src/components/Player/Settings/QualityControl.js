import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Header } from 'semantic-ui-react';

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
