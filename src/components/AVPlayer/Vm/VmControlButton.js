import { useRef } from 'react';
import { Control, usePlayerContext } from '@vime/react';
import { Icon } from 'semantic-ui-react';

export const VmShareButton = ({ onActivateSlice }) => getControlButton('share alternate', onActivateSlice);

export const VmSettingsButton = ({ onActivateSettings }) => getControlButton('settings', onActivateSettings)

const getControlButton = (iconName, onClick) =>
  (
    <Control
      // disabled={!isPlaybackReady}
      style={{ '--vm-control-scale': 0.5, margin: '0 -0.8rem', }}
      onClick={onClick}
    >
      <Icon name={iconName} />
    </Control>
  )

