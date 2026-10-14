import { useContext } from 'react';

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
  const { isMobile } = useContext(DeviceInfoContext);
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
    <div className='avbox avbox--grid'>
      <div className='avbox__main'>
        <PlaylistHeader />
        {isReady && playerContainer}
        <div id="unit_container">
          <Info />
          <Materials />
        </div>
      </div>
      {
        !isMobile && (
          <div className="avbox__aside">
            {isReady && <PlaylistItems />}
            <div className="h-[30px]" />
            {isReady && <Recommended cuId={cuId} filterOutUnits={[]} />}
          </div>
        )
      }
    </div>
  );
};

export default PlaylistPage;
