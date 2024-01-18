import React, { useContext } from 'react';
import ShareBarPlayer from './ShareBarPlayer';
import StartEnd from './StartEnd';
import CopyShareUrl from './CopyShareUrl';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../redux/modules/player';
import { PLAYER_OVER_MODES } from '../../../helpers/consts';
import { Button } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { useTranslation } from 'react-i18next';
import { playerGetOverModeSelector } from '../../../redux/selectors';

const Sharing = () => {
  const mode               = useSelector(playerGetOverModeSelector);
  const { t }              = useTranslation();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const dispatch = useDispatch();

  if (mode !== PLAYER_OVER_MODES.share) return null;

  const handleSetFull = () => dispatch(actions.setShareStartEnd({ end: Infinity, start: 0 }));

  return (
    <div className="sharing">
      <StartEnd action={
        <div className="sharing__reset" onClick={handleSetFull}>
          {
            isMobileDevice ?
              <Button size="small" icon="undo"/>
              : <Button size="small" content={t('player.share.reset-to-full')}/>
          }
        </div>
      }/>
      <div className="sharing__buttons">
        <CopyShareUrl/>
        <ShareBarPlayer/>
      </div>
    </div>
  );
};

export default Sharing;
