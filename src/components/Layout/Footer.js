import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Grid, Header, Button } from 'semantic-ui-react';
import { getRSSLinkByLangs } from '../../helpers/utils';
import { DeviceInfoContext } from '../../helpers/app-contexts';
import { settingsGetContentLanguagesSelector } from '../../redux/selectors';

const Footer = () => {
  const contentLanguages   = useSelector(settingsGetContentLanguagesSelector);
  const year               = new Date().getFullYear();
  const { isMobileDevice } = useContext(DeviceInfoContext);
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
      <Container>
        <Grid padded inverted>
          <Grid.Row>
            <Grid.Column>
              <Header inverted as="h5" floated="left">
                {t('nav.top.header')}
                <br/>
                <small className="text grey">
                  {t('nav.footer.copyright', { year })}
                  {' '}
                  {t('nav.footer.rights')}
                  {t('nav.footer.bottomTextStart') && getBottomText()}
                </small>
              </Header>

              <Button
                icon="rss"
                size="tiny"
                color="orange"
                basic
                inverted
                floated={isMobileDevice ? 'left' : 'right'}
                href={getRSSLinkByLangs(contentLanguages)}/>

              {/* Reopens the CookieYes preferences, so consent can be changed as easily as it was given (GDPR 7(3)) */}
              <Button
                icon
                size="tiny"
                basic
                inverted
                floated={isMobileDevice ? 'left' : 'right'}
                title={t('nav.footer.cookieSettings')}
                aria-label={t('nav.footer.cookieSettings')}
                onClick={() => window.revisitCkyConsent?.()}>
                <img src="https://cdn-cookieyes.com/assets/images/revisit.svg" alt="" width="16" height="16"/>
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Footer;

