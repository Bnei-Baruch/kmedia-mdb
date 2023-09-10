import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { LANG_UI_LANGUAGES } from '../../../helpers/consts';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { getLanguageLocale } from '../../../helpers/i18n-utils';

const Locale = () => {
  const uiLang = useSelector(state => settings.getUILang(state.settings));

  return (
    <Helmet>
      {<meta property="og:locale" content={getLanguageLocale(uiLang)} />}
      {
        LANG_UI_LANGUAGES
          .filter(x => x !== uiLang)
          .map(lang => <meta name="og:locale:alternate" content={getLanguageLocale(lang)} key={lang} />)
      }
    </Helmet>
  );
};

export default Locale;
