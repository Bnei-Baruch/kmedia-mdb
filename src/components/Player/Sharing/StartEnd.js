import React, { useContext } from 'react';
import { Input, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { formatTime } from '../../../helpers/time';
import { actions, selectors } from '../../../redux/modules/player';
import { withNamespaces } from 'react-i18next';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { getPosition, getDuration } from '../../../pkg/jwpAdapter/adapter';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { selectors as settings } from '../../../redux/modules/settings';

const StartEnd = ({ t }) => {
  const { start, end }     = useSelector(state => selectors.getShareStartEnd(state.player));
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const dir                = getLanguageDirection(language);
  const dispatch           = useDispatch();

  const handleSetStart = () => {
    const start = getPosition();
    const d     = { end, start };
    if (start >= end) d.end = Infinity;
    dispatch(actions.setShareStartEnd(d));
  };

  const handleSetEnd = () => {
    const end = getPosition();
    const d   = { end, start };
    if (end <= start) d.start = 0;
    dispatch(actions.setShareStartEnd(d));
  };

  const handleSetFull = () => dispatch(actions.setShareStartEnd({ end: Infinity, start: 0 }));

  return (
    <div className="sharing__times">
      <div className="sharing__inputs">
        <Input
          size="mini"
          actionPosition="left"
          fluid
          onClick={handleSetStart}
          readonly
          type="text"
          action={{
            content: t('player.share.start-position'),
            size: 'small',
            compact: true,
            onClick: handleSetStart
          }}
          placeholder={t('player.share.click-to-set')}
          value={formatTime(start)}
          dir={dir}
        />
        <Input
          size="mini"
          actionPosition="left"
          fluid
          onClick={handleSetEnd}
          readonly
          action={{
            content: t('player.share.end-position'),
            size: 'small',
            compact: true,
            onClick: handleSetEnd
          }}
          placeholder={t('player.share.click-to-set')}
          value={formatTime(end !== Infinity ? end : getDuration())}
          dir={dir}
        />
      </div>

      <div className="sharing__reset" onClick={handleSetFull}>
        {
          isMobileDevice ? <Button size="small" icon="undo" />
            : <Button size="small" content={t('player.share.reset-to-full')} />

        }

      </div>
    </div>
  );
};

export default withNamespaces()(StartEnd);
