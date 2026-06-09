import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import * as shapes from '../../../shapes';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../../helpers/consts';
import Link from '../../../Language/MultiLanguageLink';
import { PlaylistPlay as PlaylistPlayIcon, Subscriptions as SubscriptionsIcon } from '../../../../images/icons';
import { settingsGetUIDirSelector } from '../../../../redux/selectors';

const iconByNamespace = {
  [MY_NAMESPACE_REACTIONS]: 'favorite_border',
  [MY_NAMESPACE_HISTORY]: 'history',
  [MY_NAMESPACE_SUBSCRIPTIONS]: <SubscriptionsIcon className="playlist_icon" />,
  [MY_NAMESPACE_PLAYLISTS]: <PlaylistPlayIcon className="playlist_icon" />
};

const ItemTemplate = ({ children, namespace, withSeeAll = false }) => {
  const { t } = useTranslation();
  const uiDir = useSelector(settingsGetUIDirSelector);

  const seeAll = withSeeAll ? (
    <Link to={`/personal/${namespace}`} className="text-lg text-gray-500">
      {t('search.showAll')}
    </Link>
  ) : null;

  let marginClass = null;
  let icon = null;
  if ([MY_NAMESPACE_PLAYLISTS, MY_NAMESPACE_SUBSCRIPTIONS].includes(namespace)) {
    icon = iconByNamespace[namespace];
    marginClass = 'ms-2';
  } else {
    icon = <span className="material-symbols-outlined">{iconByNamespace[namespace]}</span>;
  }

  return (
    <div className="homepage__thumbnails p-4">
      <div className="w-full">
        <h2 className="my_header">
          <span className="flex items-center flex-nowrap">
            {icon}
            <span className={`${marginClass}`}>{t(`personal.${namespace}`)}</span>
          </span>
          {seeAll}
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
  t: PropTypes.func.isRequired
};

export default ItemTemplate;
