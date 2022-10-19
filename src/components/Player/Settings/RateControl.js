import { Button, Header } from 'semantic-ui-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/player';
import { withNamespaces } from 'react-i18next';

const PLAYER_SPEEDS = [0.75, 1, 1.25, 1.5, 2];

const RateControl = ({ t }) => {
  const rate = useSelector(state => selectors.getRate(state.player));
  const file = useSelector(state => selectors.getFile(state.player));

  if (!file) return null;

  const handleSetSpeed = x => window.jwplayer().setPlaybackRate(x);

  return (
    <div className="settings__row">
      <Header size="tiny">Playback speed</Header>
      <Button.Group size="mini" inverted>
        {
          PLAYER_SPEEDS.map(x => {
            const content = x !== 1 ? `${x}x` : t('normal');
            return (
              <Button
                inverted
                content={content}
                onClick={() => handleSetSpeed(x)}
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

export default withNamespaces()(RateControl);
