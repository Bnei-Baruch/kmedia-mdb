import React from 'react';
import { Input } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

import { formatTime } from '../../../src/helpers/time';
import { actions, selectors } from '../../redux/slices/playerSlice/playerSlice';
import { getPosition } from '../../../pkg/jwpAdapter/adapter';
import { getLanguageDirection } from '../../../src/helpers/i18n-utils';
import { selectors as settings } from '../../redux/slices/settingsSlice/settingsSlice';

const StartEnd = ({ action }) => {
  const { t }              = useTranslation();
  const { start = 0, end } = useSelector(state => selectors.getShareStartEnd(state.player));
  const uiDir              = useSelector(state => settings.getUIDir(state.settings));
  const { duration }       = useSelector(state => selectors.getFile(state.player));
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
            size: 'small',
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
            size: 'small',
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