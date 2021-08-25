import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Button, Grid, Header, Icon } from 'semantic-ui-react';

import * as shapes from '../../../shapes';
import Link from '../../../Language/MultiLanguageLink';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../helpers/consts';
import { ReactComponent as PlaylistPlayIcon } from '../../../../images/icons/playlist_play_black_24dp.svg';
import { ReactComponent as SubscriptionsIcon } from '../../../../images/icons/subscriptions_black_24dp.svg';

const iconByNamespace = {
  [MY_NAMESPACE_LIKES]: 'like outline',
  [MY_NAMESPACE_HISTORY]: 'history',
  [MY_NAMESPACE_SUBSCRIPTIONS]: <SubscriptionsIcon />,
  [MY_NAMESPACE_PLAYLISTS]: <PlaylistPlayIcon />,
};
const ItemTemplate    = ({ children, namespace, t, withSeeAll = false }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const itemsPerRow        = isMobileDevice ? 1 : 4;
  const seeAll             = withSeeAll ? (
    <Grid.Column textAlign={'right'}>
      <Link to={`/personal/${namespace}`}>{t('search.showAll')}</Link>
    </Grid.Column>
  ) : null;

  return (
    <div className="homepage__thumbnails">
      <Container fluid className="padded">
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <Header as={'h2'} className="my_header">
                {
                  [MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_SUBSCRIPTIONS].includes(namespace) ?
                    iconByNamespace[namespace] :
                    <Icon name={iconByNamespace[namespace]} />
                }
                {t(`personal.${namespace}`)}
              </Header>
            </Grid.Column>
            {seeAll}
          </Grid.Row>
        </Grid>
        <Card.Group itemsPerRow={itemsPerRow} stackable className="cu_items">
          {children}
        </Card.Group>
      </Container>
    </div>
  );
};

ItemTemplate.propTypes = {
  items: PropTypes.arrayOf(shapes.ContentUnit),
  t: PropTypes.func.isRequired
};

export default ItemTemplate;
