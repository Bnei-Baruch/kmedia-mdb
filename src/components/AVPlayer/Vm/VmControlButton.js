import { Control } from '@vime/react';
import { Icon } from 'semantic-ui-react';

export const VmShareButton = ({ onActivateSlice }) => getControlButton('share alternate', onActivateSlice);

export const VmSettingsButton = ({ onActivateSettings }) => getControlButton('settings', onActivateSettings)

const getControlButton = (iconName, onClick) =>
  (
    <Control
      style={{ '--vm-control-scale': 0.6, margin: '0' }}
      onClick={onClick}
    >
      <Icon name={iconName} />
    </Control>
  )

