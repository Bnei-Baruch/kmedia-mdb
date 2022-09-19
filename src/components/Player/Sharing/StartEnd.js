import { Input, Button } from 'semantic-ui-react';
import React from 'react';
import { toHumanReadableTime } from '../../../helpers/time';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/player';

const StartEnd = () => {
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
              content: 'start time',
              size: 'small',
              compact: true,
              onClick: handleSetStart
            }}
            placeholder="Click to set"
            value={toHumanReadableTime(start)}
          />
          <Input
            size="mini"
            actionPosition="left"
            action={{
              content: 'end time',
              size: 'small',
              compact: true,
              onClick: handleSetEnd
            }}
            placeholder="Click to set"
            value={toHumanReadableTime(end)}
          />
        </div>
      </div>

      <div className="sharing__reset" onClick={handleSetFull}>
        <Button size="small">Reset to full video</Button>
      </div>
    </>
  );
};

export default StartEnd;
