import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectors as my } from '../../../lib/redux/slices/mySlice/mySlice';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';
import { getSavedTime } from '../../../lib/player/helper';
import { UnitProgress } from '../../../app/components/ContentItem/UnitProgress';

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
  const [playTime, setPlayTime] = useState();
  const { id, duration }        = unit;

  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)) || [];
  const historyUnit  = historyItems.find(x => x.content_unit_uid === id);
  useEffect(() => {
    setPlayTime(getSavedTime(id, historyUnit));
  }, [id, historyUnit]);

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
      <UnitProgress unit={unit} playTime={playTime} />
      <UnitLogo unitId={unit.id} width={width} {...rest} />
    </div>
  );
};

export default UnitLogoWithDuration;
