import { useContext } from 'react';
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
  const { isMobile } = useContext(DeviceInfoContext);
  const location = useLocation();

  const { embed } = getEmbedFromQuery(location);
  const { isReady } = useSelector(playlistGetInfoSelector);
  const { cuId } = useSelector(playlistGetInfoSelector);

  if (embed) return playerContainer;
  if (!isReady) return getWipErr(!isReady, null);

  return (
    <>
      <div className='avbox avbox--grid'>
        <div className='avbox__main'>
          <div>
            {playerContainer}
          </div>
          <div>
            <div className="avbox__unit">
              <Info />
              <Materials />
            </div>
          </div>
        </div>
        {
          !isMobile && (
            <div className="avbox__aside">
              <Recommended cuId={cuId} />
            </div>
          )
        }
      </div>
    </>
  );
};

export default SingleMediaPage;
