import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'next-i18next';

import { selectors } from '../../redux/slices/playerSlice/playerSlice';
import { actions as playlistActions } from '../../redux/slices/playlistSlice/playlistSlice';
import { MT_VIDEO, MT_AUDIO } from '../../../src/helpers/consts';

const MediaTypeControlMobile = ({ t }) => {
  const { type } = useSelector(state => selectors.getFile(state.player)) || false;

  const dispatch = useDispatch();

  const handleChange = (e, { checked }) => dispatch(playlistActions.setMediaType(checked ? MT_AUDIO : MT_VIDEO));

  return (
    <div className="controls__audio">
      <Checkbox
        checked={type === MT_AUDIO}
        onChange={handleChange}
        label={t(`player.settings.audio-only-${type === MT_AUDIO ? 'on' : 'off'}`)}
        toggle
      />
    </div>
  );
};

export default withTranslation()(MediaTypeControlMobile);