import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { setPlaybackRate } from '../../../pkg/jwpAdapter/adapter';
import { playerGetFileSelector, playerGetRateSelector } from '../../../redux/selectors';

const PLAYER_SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const RateControl = ({ t }) => {
  const rate = useSelector(playerGetRateSelector);
  const file = useSelector(playerGetFileSelector);

  if (!file) return null;

  return (
    <div className="settings__row">
      <Header size="tiny">{t('player.settings.playback-speed')}</Header>
      <Button.Group size="mini" inverted>
        {
          PLAYER_SPEEDS.map(x => {
            const content = x !== 1 ? `${x}x` : t('player.settings.normal');
            return (
              <Button
                inverted
                content={content}
                onClick={() => setPlaybackRate(x)}
                active={x === rate}
                key={x}
              />
            );
          })
        }
      </Button.Group>
    </div>
  );
};

export default withTranslation()(RateControl);
