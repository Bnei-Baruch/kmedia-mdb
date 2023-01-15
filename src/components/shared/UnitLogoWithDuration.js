import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as my } from '../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';
import { getProgress } from './ContentItem/helper';

export const getLogoUnit = (content_units, historyItems) => {
  let logoUnit;
  if (historyItems.length > 0) {
    // select the latest of the history units because they arrive sorted desc by timestamp
    logoUnit = content_units.find(cu => historyItems.some(hi => hi.content_unit_uid === cu.id));
  }

  return logoUnit || content_units[0];
};

const UnitLogoWithDuration = ({ unit, ...propz }) => {
  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)) || [];
  const historyUnit = historyItems.find(x => x.content_unit_uid === unit.id);
  const playTime = historyUnit?.data.current_time;

  const { width = 140, displayDuration = true, totalDuration, ...rest } = propz;

  const durationToDisplay = displayDuration
    ? totalDuration || unit.duration
    : null;

  return (
    <div className="with_duration" style={{ minWidth: width }}>
      {
        durationToDisplay && (
          <div className="duration">
            { formatDuration(durationToDisplay, null) }
          </div>
        )
      }
      {getProgress(unit, playTime)}
      <UnitLogo unitId={unit.id} width={width} {...rest} />
    </div>
  );
};

export default UnitLogoWithDuration;
