import React from 'react';
import PropTypes from 'prop-types';
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
  [MY_NAMESPACE_REACTIONS]    : 'favorite_border',
  [MY_NAMESPACE_HISTORY]      : 'history',
  [MY_NAMESPACE_SUBSCRIPTIONS]: <SubscriptionsIcon className="playlist_icon"/>,
  [MY_NAMESPACE_PLAYLISTS]    : <PlaylistPlayIcon className="playlist_icon"/>
};

const ItemTemplate = ({ children, namespace, t, withSeeAll = false }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);

  const seeAll = withSeeAll ? (
    <div className="text-right">
      <Link to={`/personal/${namespace}`}>{t('search.showAll')}</Link>
    </div>
  ) : null;

  let marginClass = null;
  let icon        = null;
  if ([MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_SUBSCRIPTIONS].includes(namespace)) {
    icon        = iconByNamespace[namespace];
    marginClass = uiDir === 'rtl' ? ' margin-right-8' : ' margin-left-8';
  } else {
    icon = <span className="material-symbols-outlined">{iconByNamespace[namespace]}</span>;
  }

  return (
    <div className="homepage__thumbnails avbox no-background">
      <div className="w-full ">
        <h2 className="my_header">
          <span className="display-iblock">
            {icon}
            <span className={`display-iblock${marginClass}`}>{t(`personal.${namespace}`)}</span>
          </span>
          <span className="display-iblock small text-gray-500">{seeAll}</span>
        </h2>
        {
          children.length === 0 ?
            (
              <h3 className="text-center large">
                {t(`personal.no_${namespace}`)}
              </h3>
            )
            : children
        }
      </div>
    </div>
  );
};

ItemTemplate.propTypes = {
  items: PropTypes.arrayOf(shapes.ContentUnit),
  t    : PropTypes.func.isRequired
};

export default ItemTemplate;
