import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as my, actions as myActions } from '../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';
import { getProgress } from './ContentItem/helper';

const widthBySize = { 'normal': '140px' };

const UnitLogoWithDuration = ({ unit, size = 'normal', width = 144, ...propz }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(myActions.fetch(MY_NAMESPACE_HISTORY, { cu_uids: [unit.id] }));
  }, [dispatch, unit.id]);

  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)) || [];
  const historyUnit = historyItems.find(x => x.content_unit_uid === unit.id);
  const playTime = historyUnit?.data.current_time;

  return (
    <div className="with_duration" style={{ minWidth: widthBySize[size] }}>
      {
        unit.duration && (
          <div className="duration">{
            formatDuration(unit.duration, null)
          }
          </div>
        )
      }
      {getProgress(unit, playTime)}
      <UnitLogo unitId={unit.id} width={width} {...propz} />
    </div>
  );
};

export default UnitLogoWithDuration;
