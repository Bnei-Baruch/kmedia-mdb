import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_RUSSIAN, LANG_UKRAINIAN } from '../../helpers/consts';

const Vh_Button = ({ t }) => (
  DButton({ content: t('home.virtual-home'), href: `https://virtualhome.kli.one/?bbref_internal=kmedia&bbref_lang=he`, icon: 'globe', className: 'vh-button' })
);

Vh_Button.propTypes = {
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

  return DButton({ content: t('home.donate'), href: `http://kab1.com/${lang}`, icon: 'heart', className: 'donate-button' });
};

DonateNow.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(DonateNow);
