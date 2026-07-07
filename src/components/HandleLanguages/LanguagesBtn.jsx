
import { forwardRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { settingsGetUrlLangSelector } from '../../redux/selectors';


const LanguagesBtn = forwardRef((props, ref) => {
  const urlLang = useSelector(settingsGetUrlLangSelector);
  const { isMobile } = useContext(DeviceInfoContext);
  const { t } = useTranslation();

  return (
    <div ref={ref} {...props} className='flex items-center'>
      {isMobile ? (
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
