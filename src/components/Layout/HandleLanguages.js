import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';

import UILanguage from './UILanguage';
import ContentLanguage from './ContentLanguage';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const HandleLanguages = ({ language, t }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const direction               = getLanguageDirection(language);
  const popupStyle              = { direction };

  // close popup after uiLanguage change
  useEffect(() => {
    setIsActive(false);
  }, [language]);

  const Trigger = React.forwardRef((props, ref) => (
    <div onClick={handlePopupOpen} ref={ref}>
      {
        isMobileDevice
          ? <Icon size="big" name="language" className="no-margin" />
          : (
            <>
              <Icon name="sliders horizontal" />
              {t('languages.language')}
            </>
          )
      }
    </div>
  ));

  const handlePopupOpen = () => setIsActive(true);
  const handlePopupClose = () => setIsActive(false);

  return (
    <Popup
      id="handleLanguagesPopup"
      key="handleLangs"
      flowing
      position="bottom right"
      trigger={ <Trigger /> }
      open={isActive}
      onOpen={handlePopupOpen}
      onClose={handlePopupClose}
      on="click"
      style={popupStyle}
    >
      <Popup.Header>
        <div className="handle-language-header title">
          <Header size="small" textAlign="center" content={t('languages.language')} />
          <Button
            basic
            compact
            size="tiny"
            content={t('buttons.close')}
            onClick={handlePopupClose}
          />
        </div>
      </Popup.Header>
      <Popup.Content>
        <UILanguage />
        <ContentLanguage />
      </Popup.Content>
    </Popup>
  );
};

HandleLanguages.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(HandleLanguages);
