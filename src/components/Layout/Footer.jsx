import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getRSSLinkByLangs } from '../../helpers/utils';
import { settingsGetContentLanguagesSelector } from '../../redux/selectors';

const Footer = () => {
  const contentLanguages   = useSelector(settingsGetContentLanguagesSelector);
  const year               = new Date().getFullYear();
  const { t }              = useTranslation();

  const getBottomText = () => (
    <>
      <br/>
      {t('nav.footer.bottomTextStart')}
      <a href={t('nav.footer.bottomTextLink')}>{t('nav.footer.bottomTextLink')}</a>
      {t('nav.footer.bottomTextEnd')}
    </>
  );

  return (
    <div className="layout__footer">
      <div className="mx-auto">
        <div className="flex items-center justify-between p-4 max-md:flex-col max-md:items-start max-md:gap-4 max-md:px-[14px]">
          <h5 className="font-lato! text-white">
            {t('nav.top.header')}
            <br/>
            <small className="text-gray-400">
              {t('nav.footer.copyright', { year })}
              {' '}
              {t('nav.footer.rights')}
              {t('nav.footer.bottomTextStart') && getBottomText()}
            </small>
          </h5>

          <a
            href={getRSSLinkByLangs(contentLanguages)}
            className="inline-flex items-center px-2 py-1 border border-brand-orange text-brand-orange rounded text-xs hover:bg-brand-orange hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined small">rss_feed</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

