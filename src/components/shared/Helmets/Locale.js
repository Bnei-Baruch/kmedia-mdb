import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { getLanguageLocale } from '../../../helpers/i18n-utils';

const Locale = ({ mainLang, alternateLang = []}) => {
  return (
    <Helmet>
      {<meta property="og:locale" content={getLanguageLocale(mainLang)} />}
      {
        alternateLang
          .filter(x => x !== mainLang)
          .map(lang => <meta name="og:locale:alternate" content={getLanguageLocale(lang)} key={lang} />)
      }
    </Helmet>
  );
};

Locale.propTypes = {
  mainLang: PropTypes.string.isRequired,
  alternateLang: PropTypes.arrayOf(PropTypes.string),
};

export default Locale;
