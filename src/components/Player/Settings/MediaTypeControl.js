import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { actions, selectors } from '../../../redux/modules/player';
import { actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';

const MediaTypeControl = ({ t }) => {
  const { type } = useSelector(state => selectors.getFile(state.player));

  const dispatch = useDispatch();

  const handleSetMediaType = (e, { name }) => {
    batch(() => {
      dispatch(actions.continuePlay());
      dispatch(playlistActions.setMediaType(name));
    });
  };

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
              />
            )
          )
        }
      </Button.Group>
    </div>
  );
};

export default withNamespaces()(MediaTypeControl);