import React from 'react';
import { Progress } from 'semantic-ui-react';

export const UnitProgress = ({ unit, playTime }) => {
  if (!unit || !playTime) return null;

  return <Progress
    size="tiny"
    className="cu_item_progress"
    percent={playTime.current_time * 100 / unit.duration}
  />;
};
