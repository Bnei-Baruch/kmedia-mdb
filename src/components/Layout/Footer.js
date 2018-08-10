import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header } from 'semantic-ui-react';

const Footer = (props) => {
  const { t } = props;
  const year  = new Date().getFullYear();

  return (
    <div className="layout__footer">
      <Container>
        <Grid padded inverted>
          <Grid.Row>
            <Grid.Column>
              <Header inverted as="h5">
                {t('nav.top.header')}
                <br />
                <small className="text grey">
                  {t('nav.footer.copyright', { year })} {t('nav.footer.rights')}
                </small>
              </Header>
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

export default Footer;
