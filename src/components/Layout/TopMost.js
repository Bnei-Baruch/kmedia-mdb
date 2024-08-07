import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Helmets from '../shared/Helmets';

const TopMost = ({ t }) => (
  <Helmets.TopMost
    titlePostfix={t('nav.top.header')}
  />
);

TopMost.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(TopMost);
