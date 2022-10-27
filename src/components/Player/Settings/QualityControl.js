import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch, batch } from 'react-redux';

import { selectors as playlist, actions as playlistActions } from '../../../redux/modules/playlist';
import { actions, selectors } from '../../../redux/modules/player';
import { MT_AUDIO } from '../../../helpers/consts';

const QualityControl = ({ t }) => {

  const { qualityByLang }     = useSelector(state => playlist.getPlayed(state.playlist));
  const { quality, language } = useSelector(state => playlist.getInfo(state.playlist));
  const { type }              = useSelector(state => selectors.getFile(state.player));

  const dispatch = useDispatch();

  const handleSetQuality = x => {
    batch(() => {
      dispatch(actions.continuePlay());
      dispatch(playlistActions.setQuality(x));
    });
  };

  if (type === MT_AUDIO) return null;

  return (
    <div className="settings__row">
      <Header size="tiny">{t('player.settings.quality')}</Header>
      <Button.Group size="mini" inverted>
        {
          qualityByLang?.[language]?.map((x, i) => (
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

export default withNamespaces()(QualityControl);
