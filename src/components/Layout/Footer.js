import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Container, Grid, Header, Button } from 'semantic-ui-react';
import { getRSSLinkByLang } from '../../helpers/utils';
import * as shapes from '../shapes';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as device } from '../../redux/modules/device';

const Footer = ({ t, language, deviceInfo }) => {
  const year     = new Date().getFullYear();
  const isMobile = deviceInfo.device && deviceInfo.device.type === 'mobile';

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
                bordered={false}
                floated={isMobile ? 'left' : 'right'}
                href={getRSSLinkByLang(language)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

Footer.propTypes = {
  t: PropTypes.func.isRequired,
  deviceInfo: shapes.UserAgentParserResults.isRequired,
  language: PropTypes.string.isRequired
};

export default connect(state => ({
  language: settings.getLanguage(state.settings),
  deviceInfo: device.getDeviceInfo(state.device),
}))(withNamespaces()(Footer));

