import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { selectors } from '../../../redux/modules/player';
import { actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';

const MediaTypeControlMobile = ({ t }) => {
  const { type } = useSelector(state => selectors.getFile(state.player)) || false;

  const dispatch = useDispatch();

  const handleChange = (e, { checked }) => dispatch(playlistActions.setMediaType(checked ? MT_AUDIO : MT_VIDEO));

  return (
    <div className="controls__audio">
      <Checkbox
        checked={type === MT_AUDIO}
        onChange={handleChange}
        label={t(`player.settings.${type}`)}
        toggle
      />
    </div>
  );
};

export default withNamespaces()(MediaTypeControlMobile);
