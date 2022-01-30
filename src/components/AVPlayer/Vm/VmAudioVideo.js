import { useRef } from 'react';
import { withNamespaces } from 'react-i18next';
import { Control } from '@vime/react';
import { Icon } from 'semantic-ui-react';


const VmAudioVideo = ({ isVideo, onSwitchAV, t }) => {
  const ref = useRef(null);

  return (
    <Control
      ref={ref}
      style={{ '--vm-control-scale': 0.8 }}
      // class={'mediaplayer__audiovideo'}
    >
      <span onClick={onSwitchAV}>
        <Icon name={isVideo ? 'headphones' : 'video'} />
      </span>
    </Control>
  );
};

export default withNamespaces()(VmAudioVideo);
