import { Control } from '@vime/react';
import { Icon } from 'semantic-ui-react';

export const VmShareButton = ({ onClick }) => getControlButton('share alternate', onClick);

export const VmSettingsButton = ({ onClick }) => getControlButton('settings', onClick)

export const VmAudioVideo = ({ isVideo, onSwitchAV }) => {
  const iconName = isVideo ? 'headphones' : 'video';

  return getControlButton(iconName, onSwitchAV)
}

export const VmPrevNext = ({ isPrev, onClick }) => {
  const iconName = isPrev ? 'step backward' : 'step forward';

  return getControlButton(iconName, onClick)

  // return (
  //   <Control
  //     onClick={onClick}
  //     disabled={!onClick}
  //     style={{ '--vm-control-scale': 0.6 }}
  //   >
  //     <Icon name={icon} disabled={!onClick} />
  //   </Control>
  // );
};

const getControlButton = (iconName, onClick) =>
  (
    <Control
      style={{ '--vm-control-scale': 0.6 }}
      onClick={onClick}
      disabled={!onClick}
    >
      <Icon name={iconName} />
    </Control>
  )

