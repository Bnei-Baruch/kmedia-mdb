import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../redux/selectors';
import { DeviceInfoContext } from '../helpers/app-contexts';

const StyleShadowDOM = () => {
  const { isMobile } = useContext(DeviceInfoContext);
  const uiDir              = useSelector(settingsGetUIDirSelector);
  const isLtr              = uiDir === 'ltr';

  useEffect(() => {
    if (isMobile) {
      const host   = document.getElementsByTagName('us-button');
      const shadow = host?.[0]?.shadowRoot;

      const sheet  =  new CSSStyleSheet();
      const _style = isLtr ? '{transform: rotate(-90deg); bottom: 200px; right: 0; left: auto;}'
        : '{transform: rotate(90deg); bottom: 60px; left: 0; right: auto;}';
      sheet.replaceSync(`#appRoot ${_style} `);
      shadow?.adoptedStyleSheets.push(sheet);
    }
  }, [isLtr, isMobile]);
  return null;
};

export default StyleShadowDOM;
