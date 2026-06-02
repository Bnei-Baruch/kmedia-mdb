import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';

import { settingsGetUIDirSelector } from '../../redux/selectors';

/**
 *
 * @param props
 * text: text that will be on the tooltip.
 * component: component that we wrap.
 * all other props - props of wrapped component
 * @returns {JSX.Element}
 * @constructor
 */
const TooltipIfNeed = props => {
  const [need, setNeed] = useState(false);
  const [show, setShow] = useState(false);

  const { Component, text, as: asTag, content: contentProp, ...propz } = props;

  const ref = useRef();

  const dir = useSelector(settingsGetUIDirSelector);

  useEffect(() => {
    if (ref.current && (ref.current.scrollHeight > ref.current.clientHeight)) {
      setNeed(true);
    }
  }, [ref]);

  const isNativeElement = typeof Component === 'string';
  const compProps = isNativeElement ? propz : { ...propz, as: asTag, content: contentProp };
  const childContent = isNativeElement ? (contentProp || text) : undefined;

  const content = (
    <div ref={ref}>
      <Component {...compProps} className="line_clamp_2_lines">
        {childContent}
      </Component>
    </div>
  );

  if (!need) return content;

  return (
    <Popover className="relative">
      <PopoverButton
        as="div"
        className="cursor-default"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {content}
      </PopoverButton>
      {show && (
        <PopoverPanel
          static
          className="tooltip_if_need absolute z-50 bottom-full mb-1 left-1/2 -translate-x-1/2 rounded bg-white shadow-lg border border-gray-200 px-3 py-2 small"
          dir={dir}
        >
          {text}
        </PopoverPanel>
      )}
    </Popover>
  );
};

export default TooltipIfNeed;
