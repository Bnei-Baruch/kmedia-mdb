import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import CollectionLogo from '../../shared/Logo/CollectionLogo';

class CollectionPageHeader extends PureComponent {

  static propTypes = {
    collection: shapes.GenericCollection,
    namespace: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
  };

  render() {
    const { collection, namespace, t } = this.props;

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
                      {collection.content_units.length}&nbsp;{t(`pages.collection.items.${namespace}`)}
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

export default CollectionPageHeader;


