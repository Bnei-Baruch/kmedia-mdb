import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Materials from '../widgets/UnitMaterials/Materials';
import Info from '../widgets/Info/Info';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlaylistHeader from '../Playlist/PlaylistHeader';
import PlaylistItems from './PlaylistItems';
import WipErr from '../../../shared/WipErr/WipErr';
import { clsx } from 'clsx';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const PlaylistMyPage = ({ playerContainer }) => {
  const { t } = useTranslation();
  const { isReady }        = useSelector(playlistGetInfoSelector);
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { cuId }      = useSelector(playlistGetInfoSelector);
  if (!isReady)
    return WipErr({ wip: !isReady, t });

  return (
    <div className="flex flex-wrap avbox">
      <div
        className={clsx(isMobileDevice ? 'w-full' : 'w-[62.5%]', { 'is-fitted': isMobileDevice })}>
        <div id="avbox_playlist">
          <PlaylistHeader/>
        </div>
        {playerContainer}
        <div className=" px-4" id="unit_container">
          <Info/>
          <Materials/>
        </div>
      </div>
      {
        !isMobileDevice && (
          <div className="w-[37.5%]">
            <PlaylistItems/>
            <div className="my-4" />
            <Recommended cuId={cuId} filterOutUnits={[]}/>
          </div>
        )
      }
    </div>
  );
};

export default PlaylistMyPage;
