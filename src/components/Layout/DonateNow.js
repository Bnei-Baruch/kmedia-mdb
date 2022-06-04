import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Button } from 'semantic-ui-react';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH } from '../../helpers/consts';

const Vh_Button = ({ t, language }) => (
  DButton({
    content: t('home.virtual-home'),
    href: `https://kli.one/?bbref_internal=kmedia&bbref_lang=${language}&lang=${language}`,
    icon: 'globe',
    className: 'vh-button'
  })
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

const getDonateLinkDetails = language => {
  switch (language) {
    case LANG_HEBREW:
      return { linkLang: '', utmTerm: 'heb' };
    case LANG_ENGLISH:
      return { linkLang: 'en', utmTerm: 'eng' };
    case LANG_RUSSIAN:
      return { linkLang: 'ru', utmTerm: 'rus' };
    case LANG_SPANISH:
      return { linkLang: 'es', utmTerm: 'spa' };
    default:
      return { linkLang: 'en', utmTerm: 'other_lang' };
  }
};

const DonateNow = ({ t, language }) => {
  const { linkLang, utmTerm } = getDonateLinkDetails(language);
  const link                  = `https://www.kab1.com/${linkLang}?utm_source=kabbalah_media&utm_medium=button&utm_campaign=donations&utm_id=donations&utm_term=${utmTerm}&utm_content=header_button_donate`;
  return DButton({ content: t('home.donate'), href: link, icon: 'heart', className: 'donate-button' });
};

DonateNow.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(DonateNow);
