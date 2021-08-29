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
import { isLanguageRtl } from '../../../../helpers/i18n-utils';

const iconByNamespace = {
  [MY_NAMESPACE_LIKES]: 'heart outline',
  [MY_NAMESPACE_HISTORY]: 'history',
  [MY_NAMESPACE_SUBSCRIPTIONS]: <SubscriptionsIcon />,
  [MY_NAMESPACE_PLAYLISTS]: <PlaylistPlayIcon />,
};
const ItemTemplate    = ({ children, namespace, t, withSeeAll = false, language }) => {
  const { isMobileDevice, isTablet } = useContext(DeviceInfoContext);
  const itemsPerRow        = 4;
  const seeAll             = withSeeAll ? (
    <Grid.Column textAlign={'right'}>
      <Link to={`/personal/${namespace}`}>{t('search.showAll')}</Link>
    </Grid.Column>
  ) : null;

  const isRtl     = isLanguageRtl(language);
  let marginClass = null;
  let icon        = null;
  if ([MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_SUBSCRIPTIONS].includes(namespace)) {
    icon        = iconByNamespace[namespace];
    marginClass = isRtl ? ' margin-right-8' : ' margin-left-8';
  } else {
    icon = <Icon name={iconByNamespace[namespace]} />;
  }

  return (
    <div className="homepage__thumbnails">
      <Container fluid className="padded">
        <Header as={'h2'} className="my_header">
          <Header.Content className="display-iblock">
            {icon}
            <span className={`display-iblock${marginClass}`}>{t(`personal.${namespace}`)}</span>
          </Header.Content>
          <Header.Subheader className="display-iblock">{seeAll}</Header.Subheader>
        </Header>
        <Card.Group doubling itemsPerRow={itemsPerRow} stackable className="cu_items">
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
