import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Container, Grid, Header } from 'semantic-ui-react';

import { assetUrl } from '../../../helpers/Api';
import * as shapes from '../../shapes';
import CollectionLogo from '../../shared/Logo/CollectionLogo';
import Helmets from '../../shared/Helmets';

const CollectionPageHeader = ({ collection = null, namespace }) => {
  const { t } = useTranslation('common', { useSuspense: false });

  if (collection === null) {
    return <div className="collection-header" />;
  }

  const itemCount = Array.isArray(collection.cuIDs) ? collection.cuIDs.length : 0;

  return (
    <div className="collection-header">
      <Helmets.Basic title={collection.name} description={collection.description} />
      <Helmets.Image unitOrUrl={assetUrl(`logos/collections/${collection.id}.jpg`)} />

      <Container className="padded">
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <CollectionLogo collectionId={collection.id} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h1">
                <Header.Content>
                  <span className="collection-header__title">
                    {collection.name}
                  </span>
                  <Header.Subheader className="section-header__subtitle">
                    {itemCount}&nbsp;
                    {t(`pages.collection.items.${namespace}`)}
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <p className="section-header__description">{collection.description}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

CollectionPageHeader.propTypes = {
  namespace: PropTypes.string.isRequired,
  collection: shapes.GenericCollection,
};

export default CollectionPageHeader;
