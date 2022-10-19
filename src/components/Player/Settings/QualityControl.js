import { Button, Header } from 'semantic-ui-react';
import React from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { actions } from '../../../redux/modules/player';
import { selectors as playlistSelectors, actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_AUDIO } from '../../../helpers/consts';

const QualityControl = () => {

  const { qualityByLang }                = useSelector(state => playlistSelectors.getPlayed(state.playlist));
  const { quality, language, mediaType } = useSelector(state => playlistSelectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  const handleSetQuality = x => {
    batch(() => {
      dispatch(actions.continuePlay());
      dispatch(playlistActions.setQuality(x));
    });
  };

  if (mediaType === MT_AUDIO) return null;

  return (
    <div className="settings__row">
      <Header size="tiny">Quality</Header>
      <Button.Group size="mini" inverted>
        {
          qualityByLang[language]?.map((x, i) => (
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

export default QualityControl;
