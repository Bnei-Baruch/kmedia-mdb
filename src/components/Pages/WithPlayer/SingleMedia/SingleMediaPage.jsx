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
import useLessonMarkup from '../widgets/LessonFlow/useLessonMarkup';
import LessonFlowPanel from '../widgets/LessonFlow/LessonFlowPanel';
import NowNext from '../widgets/LessonFlow/NowNext';

const SingleMediaPage = ({ playerContainer }) => {
  const { isMobile } = useContext(DeviceInfoContext);
  const location = useLocation();

  const { embed } = getEmbedFromQuery(location);
  const { isReady } = useSelector(playlistGetInfoSelector);
  const { cuId } = useSelector(playlistGetInfoSelector);
  const markup   = useLessonMarkup();

  if (embed) return playerContainer;
  if (!isReady) return getWipErr(!isReady, null);

  return (
    <>
      <div className='avbox avbox--grid'>
        <div className='avbox__main'>
          <div>
            {playerContainer}
          </div>
          {markup && <NowNext markup={markup} />}
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
              {
                markup
                  ? <LessonFlowPanel markup={markup} playlist={<Recommended cuId={cuId} />} />
                  : <Recommended cuId={cuId} />
              }
            </div>
          )
        }
      </div>
    </>
  );
};

export default SingleMediaPage;
