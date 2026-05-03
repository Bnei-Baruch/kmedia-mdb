import React, { useContext } from 'react';
import { clsx } from 'clsx';

import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import PlaylistItems from './PlaylistItems';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { getEmbedFromQuery, EMBED_TYPE_PLAYER, EMBED_TYPE_PLAYLIST } from '../../../../helpers/player';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const PlaylistPage = ({ playerContainer }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location = useLocation();
  const { isReady } = useSelector(playlistGetInfoSelector);
  const { cuId } = useSelector(playlistGetInfoSelector);
  const { embed, type } = getEmbedFromQuery(location);

  if (embed && type === EMBED_TYPE_PLAYER) return playerContainer;
  if (type === EMBED_TYPE_PLAYLIST) {
    return (
      <div className="px-4 avbox">
        <PlaylistHeader />
        {isReady && playerContainer}
      </div>
    );
  }

  return (
    <div className='py-4 lg:px-4 md:px-2 avbox flex gap-4 max-md:flex-col'>
      <div className='flex-1 min-w-0'>
        <PlaylistHeader />
        {isReady && playerContainer}
        <div className="px-4" id="unit_container">
          <Info />
          <Materials />
        </div>
      </div>
      {
        !isMobileDevice && (
          <div className="max-w-[36%] max-md:hidden">
            {isReady && <PlaylistItems />}
            <div className="my-4" />
            {isReady && <Recommended cuId={cuId} filterOutUnits={[]} />}
          </div>
        )
      }
    </div>
  );
};

export default PlaylistPage;
