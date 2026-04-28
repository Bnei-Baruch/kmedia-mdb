import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, KC_BOT_USER_NAME } from '../../../helpers/consts';
import { getQuery } from '../../../helpers/url';
import bannerImg from '../../../images/DonationBanner.jpg';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import {
  settingsGetContentLanguagesSelector,
  authGetUserSelector,
  settingsGetUIDirSelector,
  settingsGetUILangSelector
} from '../../../redux/selectors';

function DonationPopup({ t }) {
  const user       = useSelector(authGetUserSelector);
  const shouldOpen = () => {
    if (user?.name === KC_BOT_USER_NAME) return false;
    const query = getQuery(location);
    if (query.showPopup)
      return true;
    const d         = new Date();
    const firstWeek = d.getDate();
    const theDay    = d.getDay();
    if (firstWeek <= 7 && (theDay === 0 || theDay === 6)) {
      const popupCountKey = `showDonationPopup_${d.toISOString().split('T')[0]}`;
      const popupCount    = parseInt(localStorage.getItem(popupCountKey) ?? 0);
      if (popupCount > 1)
        return false;
      localStorage.setItem(popupCountKey, (popupCount + 1).toString());
      return true;
    }

    return false;
  };

  const location         = useLocation();
  const contentLanguages = useSelector(settingsGetContentLanguagesSelector);
  const uiLang           = useSelector(settingsGetUILangSelector);
  const uiDir            = useSelector(settingsGetUIDirSelector);
  const isRTL            = isLanguageRtl(uiLang);

  const [open, setOpen]    = React.useState(shouldOpen());
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { linkLang, utmTerm } = getDonateLinkDetails(contentLanguages);
  const link                  = `https://www.kab1.com/${linkLang}?utm_source=kabbalah_media&utm_medium=popup&utm_campaign=donations&utm_id=donations&utm_term=${utmTerm}&utm_content=popup_link_donate`;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-white/75" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={clsx(
            'donationPopup w-full max-w-3xl rounded-lg bg-white shadow-xl overflow-hidden',
            { 'rtl': isRTL }
          )}
          dir={uiDir}
        >
          <div className="flex justify-end p-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          {isMobileDevice ? <DialogTitle className="popupHeader" /> : null}
          <div className="overflow-y-auto max-h-[70vh] p-6">
            <div className={clsx('flex gap-6', isMobileDevice ? 'flex-col' : 'flex-row')}>
              <div className={isMobileDevice ? 'w-full' : 'w-1/2'}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  <img src={bannerImg} alt="" className="w-full h-auto" />
                </a>
              </div>
              <div className={isMobileDevice ? 'w-full' : 'w-1/2'}>
                <div dangerouslySetInnerHTML={{ __html: t('home.donate-modal') }} />
              </div>
            </div>
          </div>
          <div className="flex justify-end p-4 border-t border-gray-200">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="donate-button inline-flex items-center gap-2 px-6 py-2 rounded bg-brand-blue text-white hover:bg-blue-dark transition-colors"
            >
              <span className="material-symbols-outlined text-base">favorite</span>
              {` ${t('home.donate')} `}
            </a>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

const DONATION_LINKS_DETAILS = new Map([
  [LANG_HEBREW, { linkLang: '', utmTerm: 'heb' }],
  [LANG_ENGLISH, { linkLang: 'en', utmTerm: 'eng' }],
  [LANG_RUSSIAN, { linkLang: 'ru', utmTerm: 'rus' }],
  [LANG_SPANISH, { linkLang: 'es', utmTerm: 'spa' }]
]);

const getDonateLinkDetails = contentLanguages => {
  const language = contentLanguages.find(language => DONATION_LINKS_DETAILS.has(language));
  return (language && DONATION_LINKS_DETAILS.get(language)) || { linkLang: 'en', utmTerm: 'other_lang' };
};

DonationPopup.propTypes = { t: PropTypes.func.isRequired };

export default withTranslation()(DonationPopup);
