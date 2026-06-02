import React from 'react';
import { useSelector } from 'react-redux';

import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';
import { getSavedTime } from '../Player/helper';
import { UnitProgress } from './ContentItem/UnitProgress';
import { myGetListSelector } from '../../redux/selectors';

export const getLogoUnit = (content_units, historyItems) => {
  if (!content_units)
    return null;

  let logoUnit;
  if (historyItems.length > 0) {
    // select the latest of the history units because they arrive sorted desc by timestamp
    logoUnit = content_units.find(cu => historyItems.some(hi => hi.content_unit_uid === cu.id));
  }

  return logoUnit || content_units[0];
};

const UnitLogoWithDuration = ({ unit, ...propz }) => {
  const { id, duration } = unit;

  const historyItems = useSelector(state => myGetListSelector(state, MY_NAMESPACE_HISTORY)) || [];
  const historyUnit  = historyItems.find(x => x.content_unit_uid === id);
  const current_time = getSavedTime(id, historyUnit);

  const { width = 140, displayDuration = true, totalDuration, ...rest } = propz;

  const durationToDisplay = displayDuration ? totalDuration || duration : null;

  return (
    <div className="with_duration" style={{ minWidth: width }}>
      {
        durationToDisplay && (
          <div className="duration">
            {formatDuration(durationToDisplay, null)}
          </div>
        )
      }
      <UnitProgress unit={unit} playTime={current_time}/>
      <UnitLogo unitId={unit.id} width={width} {...rest} />
    </div>
  );
};

export default UnitLogoWithDuration;
