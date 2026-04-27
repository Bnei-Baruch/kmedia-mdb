import React from 'react';

export const UnitProgress = ({ unit, playTime }) => {
  if (!unit || !playTime) return null;

  const percent = playTime * 100 / unit.duration;

  return (
    <div className="cu_item_progress">
      <div className="cu_item_progress_track">
        <div
          className="cu_item_progress_fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
