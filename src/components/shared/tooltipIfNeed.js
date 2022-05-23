import React, { useEffect, useRef, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Popup, Ref } from 'semantic-ui-react';

import { selectors as settings } from '../../redux/modules/settings';
import { isLanguageRtl } from '../../helpers/i18n-utils';

const TooltipIfNeed = props => {
  const [need, setNeed] = useState(false);

  const { Component, text, ...propz } = props;

  const ref = useRef();

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = isLanguageRtl(language) ? 'rtl' : 'ltr';

  useEffect(() => {
    if (ref.current && (ref.current.scrollHeight > ref.current.clientHeight)) {
      setNeed(true);
    }
  }, [ref.current]);

  const content = (
    <Ref innerRef={ref}>
      <Component {...propz} className="line_clamp_2_lines" />
    </Ref>
  );

  if (!need) return content;

  return (
    <Popup
      content={text}
      dir={dir}
      trigger={content}
      position="top center"
    />
  );
};

export default TooltipIfNeed;
