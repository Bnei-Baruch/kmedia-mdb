import React, { useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import TranscriptionTabToolbarWeb from './TranscriptionTabToolbarWeb';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import TranscriptionTabToolbarMobile from './TranscriptionTabToolbarMobile';
import { actions } from '../../../../../../redux/modules/textPage';
import { useInitTextUrl } from '../../../../WithText/hooks/useInitTextUrl';

const TranscriptionTab = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const linkMemo = useMemo(() => ({ pathname: null, search: { activeTab: 'transcription' } }), []);
  useInitTextUrl(linkMemo);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.setFileFilter(f => f.insert_type === 'tamlil'));
    return () => dispatch(actions.setFileFilter());
  }, []);

  const toolbar = isMobileDevice ? <TranscriptionTabToolbarMobile /> : <TranscriptionTabToolbarWeb />;
  return (
    <div className="player_page_tab">
      <TextLayoutWeb toolbar={toolbar} playerPage={true} />
    </div>
  );
};

export default TranscriptionTab;