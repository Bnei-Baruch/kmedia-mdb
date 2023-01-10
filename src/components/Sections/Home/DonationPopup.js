import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Button, Grid, Header, Image, Modal } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { LANG_ENGLISH, LANG_HEBREW, LANG_RUSSIAN, LANG_SPANISH } from '../../../helpers/consts';
import { getQuery } from '../../../helpers/url';
import banner from '../../../images/DonationBanner.jpg';
import { getLanguageDirection, isLanguageRtl } from '../../../helpers/i18n-utils';
import { selectors as settings } from '../../../redux/modules/settings';

function DonationPopup({ t }) {
  const shouldOpen = () => {
    const query = getQuery(location);
    if (!!query.showPopup)
      return true;
    const d         = new Date();
    const firstWeek = d.getDate();
    const theDay    = d.getDay();
    // First Sunday and Saturday of the week
    if (firstWeek <= 7 && (theDay == 0 || theDay == 6)) {
      const popupCountKey = `showDonationPopup_${d.toISOString().split('T')[0]}`;
      const popupCount    = parseInt(localStorage.getItem(popupCountKey) ?? 0);
      if (popupCount > 1)
        return false;
      localStorage.setItem(popupCountKey, (popupCount + 1).toString());
      return true;
    }

    return false;
  };

  const location = useLocation();
  const language = useSelector(state => settings.getLanguage(state.settings));

  const [open, setOpen]    = React.useState(shouldOpen());
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const isRTL = isLanguageRtl(language);

  const langDir = getLanguageDirection(language);

  const { linkLang, utmTerm } = getDonateLinkDetails(language);
  const link                  = `https://www.kab1.com/${linkLang}?utm_source=kabbalah_media&utm_medium=popup&utm_campaign=donations&utm_id=donations&utm_term=${utmTerm}&utm_content=popup_link_donate`;

  return (
    <Modal
      closeIcon
      className={clsx('donationPopup', { 'rtl': isRTL })}
      dir={langDir}
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

DonationPopup.propTypes = { t: PropTypes.func.isRequired };

export default withTranslation()(DonationPopup);
