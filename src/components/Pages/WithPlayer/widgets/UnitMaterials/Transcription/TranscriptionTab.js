import React, { useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import TranscriptionTabToolbarWeb from './TranscriptionTabToolbarWeb';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import TranscriptionTabToolbarMobile from './TranscriptionTabToolbarMobile';
import { actions } from '../../../../../../redux/modules/textPage';
import { useInitTextUrl } from '../../../../WithText/hooks/useInitTextUrl';
import TextLayoutMobile from '../../../../WithText/TextLayoutMobile';
import { transcriptionFileFilter } from './helper';

const TranscriptionTab = ({ id }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const linkMemo = useMemo(() => ({ pathname: null, search: { activeTab: 'transcription' } }), []);
  useInitTextUrl(linkMemo);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.setFileFilter(transcriptionFileFilter));
    return () => dispatch(actions.setFileFilter());
  }, []);

  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile id={id} toolbar={<TranscriptionTabToolbarMobile />} playerPage={true} />
        ) : (
          <TextLayoutWeb id={id} toolbar={<TranscriptionTabToolbarWeb />} playerPage={true} />
        )
      }
    </div>
  );
};

export default TranscriptionTab;
