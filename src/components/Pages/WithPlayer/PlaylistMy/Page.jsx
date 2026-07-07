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
    <div className="py-4 lg:px-4 md:px-2 avbox flex gap-4 max-md:flex-col max-md:pt-0">
      <div
        className="flex-1 min-w-0">
        <PlaylistHeader />
        {playerContainer}
        <div id="unit_container">
          <Info />
          <Materials />
        </div>
      </div>
      {
        !isMobile && (
          <div className="max-w-[360px] max-md:hidden md:w-full xl:w-auto xl:max-w-[480px] 2xl:max-w-[540px]">
            <PlaylistItems />
            <div className="my-4" />
            <Recommended cuId={cuId} filterOutUnits={[]} />
          </div>
        )
      }
    </div>
  );
};

export default PlaylistMyPage;
