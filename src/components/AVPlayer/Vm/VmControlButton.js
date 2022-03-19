import { Control, Icon } from '@vime/react';
import { Icon as SemIcon } from 'semantic-ui-react';

export const VmShareButton = ({ onClick }) => getSemControlButton('share alternate', onClick);

export const VmSettingsButton = ({ onClick }) => getControlButton('settings', onClick)

export const VmAudioVideo = ({ isVideo, onSwitchAV }) => {
  const iconName = isVideo ? 'headphones' : 'video';

  return getControlButton(iconName, onSwitchAV)
}

export const VmPrevNext = ({ isPrev, onClick }) => {
  const iconName = isPrev ? 'step backward' : 'step forward';

  return getSemControlButton(iconName, onClick)
};

const getControlButton = (iconName, onClick) =>
  (
    <Control
      onClick={onClick}
      disabled={!onClick}
    >
      <Icon name={iconName} />
    </Control>
  )


const getSemControlButton = (iconName, onClick) =>
  (
    <Control
      style={{ '--vm-control-scale': 0.6, 'margin': 0 }}
      onClick={onClick}
      disabled={!onClick}
    >
      <SemIcon name={iconName} />
    </Control>
  )

