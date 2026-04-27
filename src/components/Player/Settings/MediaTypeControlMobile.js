import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';

import { actions as playlistActions } from '../../../redux/modules/playlist';
import { MT_VIDEO, MT_AUDIO } from '../../../helpers/consts';
import { playerGetFileSelector } from '../../../redux/selectors';

const MediaTypeControlMobile = ({ t }) => {
  const { type } = useSelector(playerGetFileSelector) || false;

  const dispatch = useDispatch();

  const handleChange = e => dispatch(playlistActions.setMediaType(e.target.checked ? MT_AUDIO : MT_VIDEO));

  return (
    <div className="controls__audio">
      <label className="inline-flex items-center cursor-pointer gap-2">
        <input
          type="checkbox"
          checked={type === MT_AUDIO}
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="relative w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-colors after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4"></div>
        <span className="small">{t(`player.settings.audio-only-${type === MT_AUDIO ? 'on' : 'off'}`)}</span>
      </label>
    </div>
  );
};

export default withTranslation()(MediaTypeControlMobile);
