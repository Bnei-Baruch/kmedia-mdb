'use client';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Grid, Header, Image, Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../../src/helpers/app-contexts';
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, KC_BOT_USER_NAME } from '../../../../src/helpers/consts';
import { useSearchParams } from 'next/navigation';
import banner from '../../../../src/images/DonationBanner.jpg';
import { isLanguageRtl } from '../../../../src/helpers/i18n-utils';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { selectors } from '../../../../lib/redux/slices/authSlice/authSlice';

const DONATION_LINKS_DETAILS = new Map([
  [LANG_HEBREW, { linkLang: '', utmTerm: 'heb' }],
  [LANG_ENGLISH, { linkLang: 'en', utmTerm: 'eng' }],
  [LANG_RUSSIAN, { linkLang: 'ru', utmTerm: 'rus' }],
  [LANG_SPANISH, { linkLang: 'es', utmTerm: 'spa' }],
]);

const getDonateLinkDetails = contentLanguages => {
  const language = contentLanguages.find(language => DONATION_LINKS_DETAILS.has(language));
  return (language && DONATION_LINKS_DETAILS.get(language)) || { linkLang: 'en', utmTerm: 'other_lang' };
};

function DonationPopup() {
  const { t }        = useTranslation();
  const searchParams = useSearchParams();

  const user = useSelector(state => selectors.getUser(state.auth));

  const shouldOpen = () => {
    if (user?.name === KC_BOT_USER_NAME) return false;
    if (searchParams.has('showPopup'))
      return true;
    const d         = new Date();
    const firstWeek = d.getDate();
    const theDay    = d.getDay();
    // First Sunday and Saturday of the week
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

  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const uiLang           = useSelector(state => settings.getUILang(state.settings));
  const uiDir            = useSelector(state => settings.getUIDir(state.settings));
  const isRTL            = isLanguageRtl(uiLang);

  const [open, setOpen]    = useState(shouldOpen());
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { linkLang, utmTerm } = getDonateLinkDetails(contentLanguages);
  const link                  = `https://www.kab1.com/${linkLang}?utm_source=kabbalah_media&utm_medium=popup&utm_campaign=donations&utm_id=donations&utm_term=${utmTerm}&utm_content=popup_link_donate`;

  return (
    <Modal
      closeIcon
      className={clsx('donationPopup', { 'rtl': isRTL })}
      dir={uiDir}
      centered={!isMobileDevice}
      size="large"
      dimmer="inverted"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      {isMobileDevice ? <Header className="popupHeader" /> : ''}
      <Modal.Content scrolling>
        <Grid>
          <Grid.Row columns={isMobileDevice ? 1 : 2}>
            <Grid.Column>
              <Image
                src={banner}
                href={link}
                as="a"
                target="_blank" />
            </Grid.Column>
            <Grid.Column>
              <div dangerouslySetInnerHTML={{ __html: t('home.donate-modal') }} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => setOpen(false)}
          href={link}
          className="donate-button"
          as="a"
          target="_blank"
          content={` ${t('home.donate')} `}
          icon={'heart'}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default DonationPopup;
