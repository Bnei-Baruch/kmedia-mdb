import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_RUSSIAN, LANG_UKRAINIAN } from '../../helpers/consts';

const DonateNow = ({ t, language }) => {

  let lang = language;
  switch (lang) {
  case LANG_UKRAINIAN:
    lang = LANG_RUSSIAN;
    break;
  case LANG_ENGLISH:
    lang = '';
    break;
  default:
    break;
  }

  return (
    <Button
      compact
      basic
      size="small"
      color="blue"
      icon="heart"
      content={t('home.donate')}
      className="donate-button"
      as="a"
      href={`http://kab1.com/${lang}`}
    />
  );
};

DonateNow.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(DonateNow);
