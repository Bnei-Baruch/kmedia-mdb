import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import { LANG_UI_LANGUAGES } from '../../helpers/consts';
import { selectors as settings } from '../../redux/modules/settings';
import Helmets from '../shared/Helmets';

const TopMost = ({ t, language }) => {
  return (
    <Helmets.TopMost
      titlePostfix={t('nav.top.header')}
      mainLang={language}
      alternateLang={LANG_UI_LANGUAGES}
    />
  );
};

TopMost.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    language: settings.getLanguage(state.settings),
  })
)(withNamespaces()(TopMost));
