import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { formatTime } from '../../../helpers/time';
import { actions } from '../../../redux/modules/player';
import { getPosition } from '../../../pkg/jwpAdapter/adapter';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import {
  playerGetFileSelector,
  playerGetShareStartEndSelector,
  settingsGetUIDirSelector
} from '../../../redux/selectors';

const StartEnd = ({ action }) => {
  const { t }              = useTranslation();
  const { isMobile }       = useContext(DeviceInfoContext);
  const { start = 0, end } = useSelector(playerGetShareStartEndSelector);
  const uiDir              = useSelector(settingsGetUIDirSelector);
  const { duration }       = useSelector(playerGetFileSelector);
  const dispatch           = useDispatch();

  const handleSetStart = () => {
    const start = getPosition();
    const d     = { end, start };
    if (start >= end) d.end = Infinity;
    dispatch(actions.setShareStartEnd(d));
  };

  const handleSetEnd = () => {
    const end = getPosition() || Infinity;
    const d   = { end, start };
    if (end <= start) d.start = 0;
    dispatch(actions.setShareStartEnd(d));
  };

  const fTimeEnd = formatTime(end !== Infinity ? end : duration);
  return (
    <div className="sharing__times">
      <div className="sharing__inputs">
        <div className="flex" onClick={handleSetStart}>
          <button
            className="px-2 py-1 text-xs bg-gray-300 rounded-l whitespace-nowrap cursor-pointer"
            onClick={handleSetStart}
            title={t('player.share.start-position')}
          >
            {isMobile
              ? <span className="material-symbols-outlined text-base align-middle">horizontal_align_left</span>
              : t('player.share.start-position')}
          </button>
          <input
            className="flex-1 min-w-0 px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r bg-gray-100"
            readOnly
            type="text"
            placeholder={t('player.share.click-to-set')}
            value={formatTime(start)}
            dir={uiDir}
          />
        </div>
        <div className="flex" onClick={handleSetEnd}>
          <button
            className="px-2 py-1 text-xs bg-gray-300 rounded-l whitespace-nowrap cursor-pointer"
            onClick={handleSetEnd}
            title={t('player.share.end-position')}
          >
            {isMobile
              ? <span className="material-symbols-outlined text-base align-middle">horizontal_align_right</span>
              : t('player.share.end-position')}
          </button>
          <input
            className="flex-1 min-w-0 px-2 py-1 text-xs border border-l-0 border-gray-300 rounded-r bg-gray-100"
            readOnly
            type="text"
            placeholder={t('player.share.click-to-set')}
            value={fTimeEnd}
            dir={uiDir}
          />
        </div>
      </div>
      {action}
    </div>
  );
};

export default StartEnd;
