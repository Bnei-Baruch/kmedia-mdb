import React from 'react';
import { Input, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { toHumanReadableTime } from '../../../helpers/time';
import { actions, selectors } from '../../../redux/modules/player';
import { withNamespaces } from 'react-i18next';

const StartEnd = ({ t }) => {
  const { start, end } = useSelector(state => selectors.getShareStartEnd(state.player));

  const dispatch = useDispatch();

  const handleSetStart = () => {
    const start = window.jwplayer().getPosition();
    const d     = { end, start };
    if (start >= end) d.end = Infinity;
    dispatch(actions.setShareStartEnd(d));
  };

  const handleSetEnd = () => {
    const end = window.jwplayer().getPosition();
    const d   = { end, start };
    if (end <= start) d.start = 0;
    dispatch(actions.setShareStartEnd(d));
  };

  const handleSetFull = () => dispatch(actions.setShareStartEnd({ end: Infinity, start: 0 }));

  return (
    <>
      <div className="sharing__times">
        <div className="sharing__inputs">
          <Input
            size="mini"
            actionPosition="left"
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
      </div>

      <div className="sharing__reset" onClick={handleSetFull}>
        <Button size="small">t('player.share.reset-to-full')</Button>
      </div>
    </>
  );
};

export default withNamespaces()(StartEnd);
