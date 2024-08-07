import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Header, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import * as shapes from '../../../shapes';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../helpers/consts';
import Link from '../../../Language/MultiLanguageLink';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import SubscriptionsIcon from '../../../../images/icons/Subscriptions';
import { settingsGetUIDirSelector } from '../../../../redux/selectors';

const iconByNamespace = {
  [MY_NAMESPACE_REACTIONS]    : 'heart outline',
  [MY_NAMESPACE_HISTORY]      : 'history',
  [MY_NAMESPACE_SUBSCRIPTIONS]: <SubscriptionsIcon className="playlist_icon"/>,
  [MY_NAMESPACE_PLAYLISTS]    : <PlaylistPlayIcon className="playlist_icon"/>
};

const ItemTemplate = ({ children, namespace, t, withSeeAll = false }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);

  const seeAll = withSeeAll ? (
    <Grid.Column textAlign={'right'}>
      <Link to={`/personal/${namespace}`}>{t('search.showAll')}</Link>
    </Grid.Column>
  ) : null;

  let marginClass = null;
  let icon        = null;
  if ([MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_SUBSCRIPTIONS].includes(namespace)) {
    icon        = iconByNamespace[namespace];
    marginClass = uiDir === 'rtl' ? ' margin-right-8' : ' margin-left-8';
  } else {
    icon = <Icon name={iconByNamespace[namespace]}/>;
  }

  return (
    <div className="homepage__thumbnails avbox no-background">
      <Container fluid className="padded">
        <Header as={'h2'} className="my_header">
          <Header.Content className="display-iblock">
            {icon}
            <span className={`display-iblock${marginClass}`}>{t(`personal.${namespace}`)}</span>
          </Header.Content>
          <Header.Subheader className="display-iblock">{seeAll}</Header.Subheader>
        </Header>
        {
          children.length === 0 ?
            (
              <Header
                textAlign="center"
                size="large"
                content={t(`personal.no_${namespace}`)}
              />
            )
            : children
        }
      </Container>
    </div>
  );
};

ItemTemplate.propTypes = {
  items: PropTypes.arrayOf(shapes.ContentUnit),
  t    : PropTypes.func.isRequired
};

export default ItemTemplate;
