import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Popup } from 'semantic-ui-react';

import * as shapes from '../shapes';
import UILanguage from './UILanguage';
import ContentLanguage from './ContentLanguage';
import { getLanguageDirection } from '../../helpers/i18n-utils';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const HandleLanguages = ({ language, contentLanguage, setContentLanguage, location, t, push }) => {
  const [isActive, setIsActive] = useState(false);
  const { isMobileDevice }      = useContext(DeviceInfoContext);
  const langDir                 = getLanguageDirection(language);
  const popupStyle              = { direction: langDir };

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
      trigger={
        <Trigger />
      }
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
        <UILanguage
          language={language}
          contentLanguage={contentLanguage}
          location={location}
          push={push}
        />
        <ContentLanguage
          language={language}
          contentLanguage={contentLanguage}
          location={location}
          setContentLanguage={setContentLanguage}
          push={push}
        />
      </Popup.Content>
    </Popup>
  );
};

HandleLanguages.propTypes = {
  language: PropTypes.string.isRequired,
  contentLanguage: PropTypes.string.isRequired,
  setContentLanguage: PropTypes.func.isRequired,
  location: shapes.HistoryLocation.isRequired,
  t: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

export default HandleLanguages;
