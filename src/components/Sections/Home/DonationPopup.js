import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, Grid, Header, Image, Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH, KC_BOT_USER_NAME } from '../../../helpers/consts';
import { getQuery } from '../../../helpers/url';
import banner from '../../../images/DonationBanner.jpg';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import { settingsGetContentLanguagesSelector, authGetUserSelector, settingsGetUIDirSelector, settingsGetUILangSelector } from '../../../redux/selectors';

function DonationPopup({ t }) {
  const user       = useSelector(authGetUserSelector);
  const shouldOpen = () => {
    if (user?.name === KC_BOT_USER_NAME) return false;
    const query = getQuery(location);
    if (!!query.showPopup)
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
      {isMobileDevice ? <Header className="popupHeader"/> : ''}
      <Modal.Content scrolling>
        <Grid>
          <Grid.Row columns={isMobileDevice ? 1 : 2}>
            <Grid.Column>
              <Image
                src={banner}
                href={link}
                as="a"
                target="_blank"/>
            </Grid.Column>
            <Grid.Column>
              <div dangerouslySetInnerHTML={{ __html: t('home.donate-modal') }}/>
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
