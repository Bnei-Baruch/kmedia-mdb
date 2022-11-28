import React from 'react';
import { useSelector } from 'react-redux';

import { selectors as my } from '../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';
import { getProgress } from './ContentItem/helper';
import { getSavedTime } from '../Player/helper';

const widthBySize = { 'normal': '140px' };

const UnitLogoWithDuration = ({ unit, size = 'normal', width = 144, ...propz }) => {
  const { id, duration } = unit;

  const historyItems               = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)) || [];
  const historyUnit                = historyItems.find(x => x.content_unit_uid === id);
  const { current_time: playTime } = getSavedTime(id, historyUnit);

  return (
    <div className="with_duration" style={{ minWidth: widthBySize[size] }}>
      {
        duration && (
          <div className="duration">
            {formatDuration(duration, null)}
          </div>
        )
      }
      {getProgress(unit, playTime)}
      <UnitLogo unitId={id} width={width} {...propz} />
    </div>
  );
};

export default UnitLogoWithDuration;
