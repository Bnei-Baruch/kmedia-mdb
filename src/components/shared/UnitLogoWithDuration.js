import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as my, actions as myActions } from '../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { formatDuration } from '../../helpers/utils';
import UnitLogo from './Logo/UnitLogo';
import { getProgress } from './ContentItem/helper';
import { PAGE_SIZE } from './../Sections/Personal/History/Page';

const widthBySize = { 'normal': '140px' };

const UnitLogoWithDuration = ({ unit, size = 'normal', width = 144, ...propz }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(myActions.fetch(MY_NAMESPACE_HISTORY, { page_no: 1, page_size: PAGE_SIZE }));
  }, [dispatch, unit.id]);

  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)) || [];

  let playTime;
  const historyUnit = historyItems.find(x => x.content_unit_uid === unit.id);
  if (historyUnit) {
    playTime = historyUnit.data.current_time;
  }

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
