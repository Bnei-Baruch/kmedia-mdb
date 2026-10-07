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
    className: 'vh-button bg-white text-semantic-blue!'
  });
};

const DButton = ({ content, href, icon, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={clsx('inline-flex items-center gap-[5.5px] h-[33px] px-[14.6px] text-[13px] leading-none border border-semantic-blue text-semantic-blue rounded', className)}
  >
    {icon && (
      <span className={clsx('material-symbols-outlined text-[14px]! leading-none! opacity-80', { '[font-variation-settings:"FILL"_1]': icon === 'heart' })}>
        {icon === 'heart' ? 'favorite' : icon}
      </span>
    )}
    <span className="hidden lg:inline">{content}</span>
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
