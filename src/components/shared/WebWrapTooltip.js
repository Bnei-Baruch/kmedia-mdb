import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const defProps = {
  inverted: true,
  size: 'mini',
  position: 'top center',
};

const WebWrapTooltip = ({ trigger, ...propz }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  if (isMobileDevice)
    return trigger;
  
  const props = { ...defProps, ...propz };
  return (
    <Popup
      {...props}
      trigger={trigger}
    />
  );
};

WebWrapTooltip.propTypes = {
  content: PropTypes.string,
  trigger: PropTypes.elementType.isRequired
};

export default WebWrapTooltip;
