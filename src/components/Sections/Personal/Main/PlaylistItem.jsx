import React from 'react';
import { useSelector } from 'react-redux';
import { clsx } from 'clsx';

import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import Link from '../../../Language/MultiLanguageLink';
import PlaylistPlayIcon from '../../../../images/icons/PlaylistPlay';
import { getMyItemKey } from '../../../../helpers/my';
import { settingsGetUIDirSelector } from '../../../../redux/selectors';

export const PlaylistItem = ({ item, t, asList = false }) => {
  const uiDir = useSelector(settingsGetUIDirSelector);

  const link    = `/personal/${MY_NAMESPACE_PLAYLISTS}/${item.id}`;
  const { key } = getMyItemKey(MY_NAMESPACE_PLAYLISTS, item);

  const renderAsCard = () => (
    <Link to={link} className="block rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="my_playlist_item">
        <div className={`over_layer ${uiDir}`}>
          <h2>{item.total_items}</h2>
          <PlaylistPlayIcon className="playlist_icon" fill="#FFFFFF"/>
        </div>
        <UnitLogo unitId={item.poster_unit_uid || 'null'} width={700}/>
      </div>
      <div className="p-4">
        <h4 className="no-margin-top font-medium">{item.name}</h4>
      </div>
    </Link>
  );

  const renderAsList = () => (
    <Link
      to={link}
      key={key}
      className={clsx('block cu_item cu_item_list no-thumbnail')}
    >
      <div className="my_playlist_item">
        <div className="over_layer">
          <h3>{item.total_items || 0}</h3>
          <span className="material-symbols-outlined text-2xl">list</span>
        </div>
        <UnitLogo unitId={item.poster_unit_uid || 'null'} width={165}/>
      </div>
      <div className={`cu_item_info ${uiDir}`}>
        <h4 className="weight-normal no-margin-top">
          {item.name}
          <span className="block small text-gray-500">{`${item.total_items || 0} ${t('personal.videosOnList')}`}</span>
        </h4>
      </div>
    </Link>
  );

  return asList ? renderAsList() : renderAsCard();
};
