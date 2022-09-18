import { Input, Button } from 'semantic-ui-react';
import React from 'react';
import ShareBarPlayer from './ShareBarPlayer';
import StartEnd from './StartEnd';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/player';
import CopyToClipboard from 'react-copy-to-clipboard';
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
