import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_RUSSIAN, LANG_UKRAINIAN } from '../../helpers/consts';

const Vh_Button = ({ t }) => {
  console.log("Type of t is:", typeof t);
  return <Button
    compact
    basic
    size="small"
    icon="globe"
    content={t('home.virtual-home')}
    className="vh-button"
    as="a"
    href={`https://virtualhome.kli.one/?bbref_internal=kmedia&bbref_lang=he`}
    target="_blank"
  />
};

Vh_Button.propTypes = {
  t: PropTypes.func.isRequired,
};

export const VirtualHomeButton = withNamespaces()(Vh_Button);

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
