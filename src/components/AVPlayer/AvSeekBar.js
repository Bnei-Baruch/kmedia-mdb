import React from 'react';

const AvSeekBar = ({ duration, start = 0, end = Infinity }) => {
  if (!duration) return  null
  const left  = `${100 * start / duration}%`;
  const width = `${100 * (end - start) / duration}%`;
  return (
    <div className="seekbar" tabIndex="0">
      <div
        className="is-slice"
        style={{ left, width }}
      />
    </div>
  );
};

export default AvSeekBar;
