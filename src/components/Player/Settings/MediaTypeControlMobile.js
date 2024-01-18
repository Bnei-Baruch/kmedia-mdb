import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';
import { playerGetFileSelector } from '../../../redux/selectors';

const MediaTypeControlMobile = ({ t }) => {
  const { type } = useSelector(playerGetFileSelector) || false;

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
