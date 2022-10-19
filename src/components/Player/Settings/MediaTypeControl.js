import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { useSelector, useDispatch, batch } from 'react-redux';

import { actions } from '../../../redux/modules/player';
import { selectors as playlistSelectors, actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';

const MediaTypeControl = () => {
  const mediaType = useSelector(state => playlistSelectors.getInfo(state.playlist).mediaType);

  const dispatch = useDispatch();

  const handleSetMediaType = (e, { name }) => {
    batch(() => {
      dispatch(actions.continuePlay());
      dispatch(playlistActions.setMediaType(name));
    });
  };

  return (
    <div className="settings__row">
      <Header size="tiny">Playback</Header>
      <Button.Group size="mini" inverted>
        <Button
          inverted
          onClick={handleSetMediaType}
          name={MT_VIDEO}
          key={MT_VIDEO}
          content="Video"
          active={mediaType === MT_VIDEO}
        />
        <Button
          inverted
          onClick={handleSetMediaType}
          name={MT_AUDIO}
          key={MT_AUDIO}
          content="Audio"
          active={mediaType === MT_AUDIO}
        />
      </Button.Group>
    </div>
  );
};

export default MediaTypeControl;
