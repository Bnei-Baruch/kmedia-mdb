
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { settingsGetUrlLangSelector } from '../../redux/selectors';

/* eslint-disable react/display-name */
const LanguagesBtn = React.forwardRef((props, ref) => {
  const urlLang = useSelector(settingsGetUrlLangSelector);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t } = useTranslation();

  return (
    <div ref={ref} {...props}>
      {isMobileDevice ? (
        <span className="material-symbols-outlined text-3xl no-margin">language</span>
      ) : (
        <div className="language-trigger">
          {urlLang && <span className="material-symbols-outlined">link_off</span>}
          {!urlLang && <span className="material-symbols-outlined">tune</span>}
          {t('languages.language')}
        </div>
      )}
    </div>
  );
});
export default LanguagesBtn;
