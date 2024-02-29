import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Popup, Ref } from 'semantic-ui-react';

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

  const { Component, text, ...propz } = props;

  const ref = useRef();

  const dir = useSelector(settingsGetUIDirSelector);

  useEffect(() => {
    if (ref.current && (ref.current.scrollHeight > ref.current.clientHeight)) {
      setNeed(true);
    }
  }, [ref]);

  const content = (
    <Ref innerRef={ref}>
      <Component {...propz} className="line_clamp_2_lines"/>
    </Ref>
  );

  if (!need) return content;

  return (
    <Popup
      content={text}
      dir={dir}
      trigger={content}
      position="top center"
      className="tooltip_if_need"
    />
  );
};

export default TooltipIfNeed;
