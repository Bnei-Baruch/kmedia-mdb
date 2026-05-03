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
      <div className='flex flex-wrap avbox max-md:p4'>
        <div className='flex-1 min-w-0'>
          <div>
            {playerContainer}
          </div>
          <div>
            <div className="max-md:px-4">
              <Info />
              <Materials />
            </div>
          </div>
        </div>
        {
          !isMobileDevice && (
            <div className="w-[36%]">
              <Recommended cuId={cuId} />
            </div>
          )
        }
      </div>
    </>
  );
};

export default SingleMediaPage;
