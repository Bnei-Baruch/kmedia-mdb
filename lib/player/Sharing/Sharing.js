import React, { useContext } from 'react';
import ShareBarPlayer from './ShareBarPlayer';
import StartEnd from './StartEnd';
import CopyShareUrl from './CopyShareUrl';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as player, actions } from '../../redux/slices/playerSlice/playerSlice';
import { PLAYER_OVER_MODES } from '../../../src/helpers/consts';
import { Button } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../../src/helpers/app-contexts';
import { useTranslation } from 'next-i18next';

const Sharing = () => {
  const mode               = useSelector(state => player.getOverMode(state.player));
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
              <Button size="small" icon="undo" />
              : <Button size="small" content={t('player.share.reset-to-full')} />
          }
        </div>
      } />
      <div className="sharing__buttons">
        <CopyShareUrl />
        <ShareBarPlayer />
      </div>
    </div>
  );
};

export default Sharing;
