import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Container, Grid, Header } from 'semantic-ui-react';
import { getRSSLinkByLang } from '../../helpers/utils';
import { selectors as settings } from '../../redux/modules/settings';
import { DeviceInfoContext } from '../../helpers/app-contexts';

const Footer = () => {
  const { t }              = useTranslation('common', { useSuspense: false });
  const language           = useSelector(state => settings.getLanguage(state.settings));
  const year               = new Date().getFullYear();
  const { isMobileDevice } = useContext(DeviceInfoContext);

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
                </small>
              </Header>

              <Button
                icon="rss"
                size="tiny"
                color="orange"
                basic
                inverted
                floated={isMobileDevice ? 'left' : 'right'}
                href={getRSSLinkByLang(language)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

export default Footer;

