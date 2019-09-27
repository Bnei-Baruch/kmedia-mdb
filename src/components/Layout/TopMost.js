import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import { LANG_UI_LANGUAGES } from '../../helpers/consts';
import { selectors as settings } from '../../redux/modules/settings';
import Helmets from '../shared/Helmets';

const TopMost = ({ t }) => {
  const language  = useSelector(state => settings.getLanguage(state.settings));

  return (
    <Helmets.TopMost
      titlePostfix={t('nav.top.header')}
      mainLang={language}
      alternateLang={LANG_UI_LANGUAGES}
    />
  );
};

TopMost.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(TopMost);
