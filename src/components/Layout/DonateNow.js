import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import {LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, LANG_UKRAINIAN} from '../../helpers/consts';

const Vh_Button = ({ t, language }) => (
  DButton({ content: t('home.virtual-home'), href: `https://kli.one/?bbref_internal=kmedia&bbref_lang=${language}&lang=${language}`, icon: 'globe', className: 'vh-button' })
);

Vh_Button.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export const VirtualHomeButton = withNamespaces()(Vh_Button);

const DButton = ({ content, href, icon, className, color = 'blue' }) => (
  <Button
    compact
    basic
    size="small"
    color={color}
    icon={icon}
    content={content}
    className={className}
    as="a"
    href={href}
    target="_blank"
  />
);

const getDonateLang = (language) => {
  switch (language) {
    case LANG_HEBREW:
      return LANG_HEBREW;
    case LANG_RUSSIAN:
    case LANG_UKRAINIAN:
      return LANG_RUSSIAN;
    case LANG_SPANISH:
      return LANG_SPANISH;
    default:
      return LANG_ENGLISH;
  }
}

const DonateNow = ({ t, language }) => {
  let lang = getDonateLang(language);
  return DButton({ content: t('home.donate'), href: `https://kab1.com/${lang}`, icon: 'heart', className: 'donate-button' });
};

DonateNow.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(DonateNow);
