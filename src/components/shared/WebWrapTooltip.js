import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const WebWrapTooltip = ({ trigger, content }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const [show, setShow] = useState(false);

  if (isMobileDevice)
    return trigger;

  return React.cloneElement(trigger, {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    children: (
      <>
        {trigger.props.children}
        {show && content && (
          <span className="absolute z-50 bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-800 text-white shadow-lg px-2 py-1 text-xs whitespace-nowrap pointer-events-none">
            {content}
          </span>
        )}
      </>
    ),
  });
};

WebWrapTooltip.propTypes = {
  content: PropTypes.string,
  trigger: PropTypes.object.isRequired
};

export default WebWrapTooltip;
