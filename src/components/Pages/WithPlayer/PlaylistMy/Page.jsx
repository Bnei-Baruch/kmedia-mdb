import { useContext } from 'react';
import { useSelector } from 'react-redux';

import Materials from '../widgets/UnitMaterials/Materials';
import Info from '../widgets/Info/Info';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlaylistHeader from '../Playlist/PlaylistHeader';
import PlaylistItems from './PlaylistItems';
import { getWipErr } from '../../../shared/WipErr/WipErr';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const PlaylistMyPage = ({ playerContainer }) => {
  const { isReady } = useSelector(playlistGetInfoSelector);
  const { isMobile } = useContext(DeviceInfoContext);
  const { cuId } = useSelector(playlistGetInfoSelector);
  if (!isReady)
    return getWipErr(!isReady, null);

  return (
    <div className="avbox avbox--grid">
      <div
        className="avbox__main">
        <PlaylistHeader />
        {playerContainer}
        <div id="unit_container">
          <Info />
          <Materials />
        </div>
      </div>
      {
        !isMobile && (
          <div className="avbox__aside">
            <PlaylistItems />
            <div className="h-[30px]" />
            <Recommended cuId={cuId} filterOutUnits={[]} />
          </div>
        )
      }
    </div>
  );
};

export default PlaylistMyPage;
