import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Container, Grid, Header, Button } from 'semantic-ui-react';
import { getRSSLinkByLang } from '../../helpers/utils';
import { selectors as settings } from '../../redux/modules/settings';
import { DeviceInfoContext } from "../../helpers/app-contexts";

const Footer = ({ t }) => {
  const language = useSelector(state => settings.getLanguage(state.settings));
  const year = new Date().getFullYear();
  const { isMobileDevice } = useContext(DeviceInfoContext);

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
                href={getRSSLinkByLang(language)}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

Footer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(Footer);

