import React, { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Container, Grid, Header, Button } from 'semantic-ui-react';
import { getRSSLinkByLangs } from '../../helpers/utils';
import { selectors as settings } from '../../../lib/redux/slices/settingsSlice/settingsSlice';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const Footer = () => {
  const contentLanguages   = useSelector(state => settings.getContentLanguages(state.settings));
  const year               = new Date().getFullYear();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const getBottomText = () => (
    <>
      <br />
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
                <br />
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
                href={getRSSLinkByLangs(contentLanguages)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Footer;

