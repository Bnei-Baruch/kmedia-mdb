import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

import Helmets from './Helmets';

const SectionHeader = (props) => {
  const { section, submenuItems, t } = props;

  const title   = t(`${section}.header.text`);
  const subText = t(`${section}.header.subtext`);

  return (
    <div className="section-header">
      {/* TODO: dont use image fixed url */}
      <Helmets.Basic title={title} description={subText} />

      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column computer={10} tablet={12} mobile={16}>
              <Header as="h1" color="blue">
                <Header.Content>
                  <span className="section-header__title">
                    {title}
                  </span>
                  {
                    subText ?
                      <Header.Subheader className="section-header__subtitle">
                        {subText}
                      </Header.Subheader>
                      : null
                  }
                </Header.Content>
              </Header>
            </Grid.Column>
          </Grid.Row>
          {
            Array.isArray(submenuItems) && submenuItems.length > 0 ?
              <Grid.Row>
                <Grid.Column>
                  <Menu tabular className="section-header__menu" size="huge">
                    {submenuItems}
                  </Menu>
                </Grid.Column>
              </Grid.Row> :
              null
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

SectionHeader.defaultProps = {
  submenuItems: [],
};

export default translate()(SectionHeader);
