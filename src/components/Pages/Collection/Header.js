import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Container, Grid, Header } from 'semantic-ui-react';

import { assetUrl } from '../../../helpers/Api';
import * as shapes from '../../shapes';
import CollectionLogo from '../../shared/Logo/CollectionLogo';
import Helmets from '../../shared/Helmets';
import { getRSSLinkByTopic } from '../../../helpers/utils';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';
import ShareForm from './ShareForm';
import SubscribeBtn from '../../shared/SubscribeBtn';

const CollectionPageHeader = ({ collection = null, namespace, title = namespace, t }) => {
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));

  if (collection === null) {
    return <div className="collection-header" />;
  }

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
                    <p className="section-header__description">{collection.description}</p>
                    <Button
                      icon="rss"
                      size="mini"
                      color="orange"
                      compact={true}
                      href={getRSSLinkByTopic(collection.id, contentLanguages)} />
                    <ShareForm collection={collection} />
                    <div className="margin-top-8 display-iblock">
                      <SubscribeBtn collection={collection} />
                    </div>
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

CollectionPageHeader.propTypes = {
  collection: shapes.GenericCollection,
  namespace: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(CollectionPageHeader);
