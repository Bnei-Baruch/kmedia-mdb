import React from 'react';
import { Input } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { formatTime } from '../../../helpers/time';
import { actions } from '../../../redux/modules/player';
import { getPosition } from '../../../pkg/jwpAdapter/adapter';
import { playerGetFileSelector, playerGetShareStartEndSelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const StartEnd = ({ action }) => {
  const { t }              = useTranslation();
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
        <Input
          size="mini"
          actionPosition="left"
          fluid
          onClick={handleSetStart}
          readOnly
          type="text"
          action={{
            content: t('player.share.start-position'),
            size   : 'small',
            compact: true,
            onClick: handleSetStart
          }}
          placeholder={t('player.share.click-to-set')}
          value={formatTime(start)}
          dir={uiDir}
        />
        <Input
          size="mini"
          actionPosition="left"
          fluid
          onClick={handleSetEnd}
          readOnly
          action={{
            content: t('player.share.end-position'),
            size   : 'small',
            compact: true,
            onClick: handleSetEnd
          }}
          placeholder={t('player.share.click-to-set')}
          value={fTimeEnd}
          dir={uiDir}
        />
      </div>
      {action}
    </div>
  );
};

export default StartEnd;
