import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

const SectionHeader = (props) => {
  const { section, t } = props;

  return (
    <div className="section-header">
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column computer={10} tablet={12} mobile={16}>
              <Header as="h1" color="blue">
                <Header.Content>
                  {t(`${section}.header.text`)}
                  <Header.Subheader>
                    {t(`${section}.header.subtext`)}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

SectionHeader.propTypes = {
  section: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default translate()(SectionHeader);
