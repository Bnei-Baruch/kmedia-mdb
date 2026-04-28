import React from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH } from '../../helpers/consts';
import { useSelector } from 'react-redux';
import { settingsGetUILangSelector } from '../../redux/selectors';

export const VirtualHomeButton = () => {
  const uiLang = useSelector(settingsGetUILangSelector);
  const { t }  = useTranslation();
  return DButton({
    content  : t('home.virtual-home'),
    href     : `https://kli.one/?bbref_internal=kmedia&bbref_lang=${uiLang}&lang=${uiLang}`,
    icon     : 'globe',
    className: 'vh-button'
  });
};

const DButton = ({ content, href, icon, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={clsx('inline-flex items-center gap-1.5 px-3 py-1 small border border-semantic-blue text-semantic-blue rounded', className)}
  >
    {icon && <span className="material-symbols-outlined text-base">{icon === 'heart' ? 'favorite' : icon}</span>}
    {content}
  </a>
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

const DonateNow = () => {
  const uiLang = useSelector(settingsGetUILangSelector);
  const { t }  = useTranslation();

  const { linkLang, utmTerm } = getDonateLinkDetails(uiLang);
  const link                  = `https://www.kab1.com/${linkLang}?utm_source=kabbalah_media&utm_medium=button&utm_campaign=donations&utm_id=donations&utm_term=${utmTerm}&utm_content=header_button_donate`;
  return DButton({ content: t('home.donate'), href: link, icon: 'heart', className: 'donate-button' });
};

export default DonateNow;
