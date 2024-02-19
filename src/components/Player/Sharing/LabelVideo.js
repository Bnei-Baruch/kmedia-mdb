import React from 'react';
import StartEnd from './StartEnd';
import { useSelector } from 'react-redux';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { toHumanReadableTime } from '../../../helpers/time';
import TagVideoLabelBtn from '../../Pages/WithPlayer/widgets/Info/TagVideoLabelBtn';
import SavePlaylistItemBtn from '../../Pages/WithPlayer/widgets/Info/SavePlaylistItemBtn';
import {
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  playerGetOverModeSelector,
  playerGetShareStartEndSelector
} from '../../../redux/selectors';

const LabelVideo = () => {
  const mode     = useSelector(playerGetOverModeSelector);
  const { cuId } = useSelector(playlistGetInfoSelector);
  const unit     = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId));

  const { start = 0, end } = useSelector(playerGetShareStartEndSelector);

  if (![PLAYER_OVER_MODES.tagging, PLAYER_OVER_MODES.playlist].includes(mode)) return null;

  const label  = {
    properties  : { sstart: toHumanReadableTime(start), send: toHumanReadableTime(end) },
    content_unit: unit.id,
    media_type  : 'media'
  };
  const action = mode === PLAYER_OVER_MODES.tagging ? (
    <TagVideoLabelBtn label={label}/>
  ) : (
    <SavePlaylistItemBtn label={label}/>
  );

  return (
    <div className="sharing">
      <StartEnd action={action}/>
    </div>
  );
};

export default LabelVideo;
