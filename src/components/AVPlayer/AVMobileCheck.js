import React, { useContext } from 'react';
import { ClientChroniclesContext, DeviceInfoContext } from '../../helpers/app-contexts';
import VmPlayer from './Vm/VmPlayer';

const AVMobileCheck = props => {
  const { undefinedDevice } = useContext(DeviceInfoContext);
  const chronicles          = useContext(ClientChroniclesContext);

  return undefinedDevice
    ? (
      <>
        {/*<AVPlayer {...props} chronicles={chronicles} />*/}
        <VmPlayer {...props} chronicles={chronicles} />
      </>
    )
    : (
      <>
        <VmPlayer {...props} chronicles={chronicles} />
        {/*<AVPlayerMobile {...props} chronicles={chronicles} />*/}
      </>
    );
}

export default AVMobileCheck;
