import React, { useContext } from 'react';
import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Recommended from '../widgets/Recommended/Main/Recommended';
import { getEmbedFromQuery } from '../../../../helpers/player';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import { getWipErr } from '../../../shared/WipErr/WipErr';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const SingleMediaPage = ({ playerContainer }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location = useLocation();

  const { embed } = getEmbedFromQuery(location);
  const { isReady } = useSelector(playlistGetInfoSelector);
  const { cuId } = useSelector(playlistGetInfoSelector);

  if (embed) return playerContainer;
  if (!isReady) return getWipErr(!isReady, null);

  return (
    <>
      <div className={clsx('flex flex-wrap avbox', { 'p-4': !isMobileDevice })}>
        <div
          className={clsx(isMobileDevice ? 'w-full' : 'w-[62.5%]', { 'is-fitted': isMobileDevice })}>
          <div>
            {playerContainer}
          </div>
          <div>
            <div className="unit_container">
              <Info />
              <Materials />
            </div>
          </div>
        </div>
        {
          !isMobileDevice && (
            <div className="w-[37.5%]">
              <Recommended cuId={cuId} />
            </div>
          )
        }
      </div>
    </>
  );
};

export default SingleMediaPage;
