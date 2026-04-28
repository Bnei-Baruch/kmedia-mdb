import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const WebWrapTooltip = ({ trigger, content }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const [show, setShow] = useState(false);

  if (isMobileDevice)
    return trigger;

  return (
    <Popover className="relative inline-block">
      <PopoverButton
        as="div"
        className="cursor-default"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {trigger}
      </PopoverButton>
      {show && (
        <PopoverPanel
          static
          className="absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 rounded bg-gray-800 text-white shadow-lg px-2 py-1 text-xs whitespace-nowrap"
        >
          {content}
        </PopoverPanel>
      )}
    </Popover>
  );
};

WebWrapTooltip.propTypes = {
  content: PropTypes.string,
  trigger: PropTypes.object.isRequired
};

export default WebWrapTooltip;
