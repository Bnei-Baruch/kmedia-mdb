import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';
import Helmets from './Helmets';

const SectionHeader = (props) => {
  const { section, submenuItems, t } = props;

  const sectionHeader = t(`${section}.header.text`);
  const sectionSubText =  t(`${section}.header.subtext`);
  return (
    <div className="section-header">
      {/* TODO (orin): dont use image fixed url */}
      <Helmets.Basic
        title={sectionHeader}
        description={sectionSubText}
        image="https://archive.kbb1.com/static/media/event_logo.d123ade4.png"
      />
      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column computer={10} tablet={12} mobile={16}>
              <Header as="h1" color="blue">
                <Header.Content>
                  <span className="section-header__title">
                    {sectionHeader}
                  </span>
                  {
                    sectionSubText ?
                      <Header.Subheader className="section-header__subtitle">
                        {sectionSubText}
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
                  <Menu tabular className="section-header__menu" size="huge" children={submenuItems} />
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
