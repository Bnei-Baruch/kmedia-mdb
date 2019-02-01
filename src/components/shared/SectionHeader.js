import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

import Helmets from './Helmets';

class SectionHeader extends Component {
  static propTypes = {
    section: PropTypes.string.isRequired,
    submenuItems: PropTypes.arrayOf(PropTypes.node),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    submenuItems: [],
  };

  renderTitle = (title, subText) => {
    const { submenuItems } = this.props;

    return (
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
    );
  };

  render() {
    const { section, t } = this.props;

    const title   = t(`${section}.header.text`);
    const subText = t(`${section}.header.subtext`);

    return (
      <div className="section-header">
        {/* TODO: dont use image fixed url */}
        <Helmets.Basic title={title} description={subText} />

        <Container className="padded">
          {this.renderTitle(title, subText)}
        </Container>
      </div>
    );
  }
}
export default withNamespaces()(SectionHeader);

