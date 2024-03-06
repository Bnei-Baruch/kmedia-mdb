import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { LANG_UI_LANGUAGES } from '../../../helpers/consts';
import { getLanguageLocale } from '../../../helpers/i18n-utils';
import { settingsGetUILangSelector } from '../../../redux/selectors';

const Locale = () => {
  const uiLang = useSelector(settingsGetUILangSelector);

  return (
    <Helmet>
      {<meta property="og:locale" content={getLanguageLocale(uiLang)}/>}
      {
        LANG_UI_LANGUAGES
          .filter(x => x !== uiLang)
          .map(lang => <meta name="og:locale:alternate" content={getLanguageLocale(lang)} key={lang}/>)
      }
    </Helmet>
  );
};

export default Locale;
