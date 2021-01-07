import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

import Helmets from './Helmets';
import i18next from "i18next";

const SectionHeader = ({ section, t, submenuItems }) => {
  const title   = t(`${section}.header.text`);
  const subText1 = t(`${section}.header.subtext`);
  const subText2 = i18next.exists(`${section}.header.subtext2`) ? t(`${section}.header.subtext2`) : '';

  return (
    <div className="section-header">
      <Helmets.Basic title={title} description={subText1} />
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header as="h1" color="blue">
                <Header.Content>
                  <span className="section-header__title">
                    {title}
                  </span>
                  {
                    subText1 &&
                      <Header.Subheader className="section-header__subtitle">
                        {subText1}
                      </Header.Subheader>
                  }
                  {
                    subText2 &&
                      <Header.Subheader className="section-header__subtitle2">
                        {subText2}
                      </Header.Subheader>
                  }
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
          {
            Array.isArray(submenuItems) && submenuItems.length > 0 &&
              <Grid.Row>
                <Grid.Column>
                  <Menu tabular className="section-header__menu" size="huge">
                    {submenuItems}
                  </Menu>
                </Grid.Column>
              </Grid.Row>
          }
        </Grid>
      </Container>
    </div>
  );
};

SectionHeader.propTypes = {
  section: PropTypes.string.isRequired,
  submenuItems: PropTypes.arrayOf(PropTypes.node),
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(SectionHeader);
