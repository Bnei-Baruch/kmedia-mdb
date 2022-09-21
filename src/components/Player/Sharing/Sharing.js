import React from 'react';
import ShareBarPlayer from './ShareBarPlayer';
import StartEnd from './StartEnd';
import CopyShareUrl from './CopyShareUrl';

const Settings = () => {
  return (
    <div className="sharing">
      <div className="sharing__times">
        <StartEnd />
      </div>
      <div className="sharing__buttons">
        <CopyShareUrl />
        <ShareBarPlayer />
      </div>
    </div>
  );
};

export default Settings;
