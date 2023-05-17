import React from 'react';
import StartEnd from './StartEnd';
import { useSelector } from 'react-redux';
import { selectors as player, selectors } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES, MT_VIDEO } from '../../../helpers/consts';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { toHumanReadableTime } from '../../../helpers/time';
import TagVideoLabelBtn from '../../Pages/WithPlayer/widgets/Info/TagVideoLabelBtn';
import SavePlaylistItemBtn from '../../Pages/WithPlayer/widgets/Info/SavePlaylistItemBtn';

const LabelVideo = () => {
  const mode     = useSelector(state => player.getOverMode(state.player));
  const { cuId } = useSelector(state => playlist.getInfo(state.playlist));
  const unit     = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));

  const { start = 0, end } = useSelector(state => selectors.getShareStartEnd(state.player));

  if (![PLAYER_OVER_MODES.tagging, PLAYER_OVER_MODES.playlist].includes(mode)) return null;

  const label  = {
    properties: { sstart: toHumanReadableTime(start), send: toHumanReadableTime(end) },
    content_unit: unit.id,
    media_type: MT_VIDEO
  };
  const action = mode === PLAYER_OVER_MODES.tagging ? (
    <TagVideoLabelBtn label={label} />
  ) : (
    <SavePlaylistItemBtn label={label} />
  );

  return (
    <div className="sharing">
      <StartEnd action={action} />
    </div>
  );
};

export default LabelVideo;
