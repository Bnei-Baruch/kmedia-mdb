import React from 'react';
import ShareBarPlayer from './ShareBarPlayer';
import StartEnd from './StartEnd';
import CopyShareUrl from './CopyShareUrl';

const Sharing = () => {
  return (
    <div className="sharing">
      <StartEnd />
      <div className="sharing__buttons">
        <CopyShareUrl />
        <ShareBarPlayer />
      </div>
    </div>
  );
};

export default Sharing;
