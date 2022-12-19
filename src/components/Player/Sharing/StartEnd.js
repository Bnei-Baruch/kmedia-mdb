import React, { useContext } from 'react';
import { Input, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { toHumanReadableTime } from '../../../helpers/time';
import { actions, selectors } from '../../../redux/modules/player';
import { withNamespaces } from 'react-i18next';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { getPosition } from '../../../pkg/jwpAdapter/adapter';

const StartEnd = ({ t }) => {
  const { start, end }     = useSelector(state => selectors.getShareStartEnd(state.player));
  const { isMobileDevice } = useContext(DeviceInfoContext);
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
          action={{
            content: t('player.share.start-position'),
            size: 'small',
            compact: true,
            onClick: handleSetStart
          }}
          placeholder={t('player.share.click-to-set')}
          value={toHumanReadableTime(start)}
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
          value={toHumanReadableTime(end)}
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
