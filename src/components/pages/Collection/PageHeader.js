import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import CollectionLogo from '../../shared/Logo/CollectionLogo';

class PageHeader extends PureComponent {

  static propTypes = {
    collection: shapes.GenericCollection,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
  };

  render() {
    const { collection, t } = this.props;

    return (
      <div className="section-header">
        <Container className="padded">
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
                <CollectionLogo collectionId={collection.id} />
              </Grid.Column>
              <Grid.Column width={8}>
                <Header as="h1">
                  <Header.Content>
                    {collection.name}
                    <Header.Subheader>
                      {collection.content_units.length}&nbsp;{t('publications.c.items')}
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                <p>{collection.description}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(PageHeader);


