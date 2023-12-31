import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import { selectors as mdb } from '../../../../../../redux/modules/mdb';
import { MT_TEXT, CT_LIKUTIM, CT_SOURCE } from '../../../../../../helpers/consts';
import SourceToolbarMobile from '../../../../../Sections/Source/SourceToolbarMobile';
import SourceToolbarWeb from '../../../../../Sections/Source/SourceToolbarWeb';
import TranscriptionTabToolbarMobile from '../Transcription/TranscriptionTabToolbarMobile';
import TranscriptionTabToolbarWeb from '../Transcription/TranscriptionTabToolbarWeb';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import SourceTabToolbarMobile from './SourceTabToolbarMobile';
import SourceTabToolbarWeb from './SourceTabToolbarWeb';

const SourceTab = () => {
  const { id } = useParams();

  const pageCu = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const cus    = Object.values(pageCu.derived_units)
    .filter(x => [CT_LIKUTIM, CT_SOURCE].includes(x.content_type))
    .filter(x => (x.files || []).some(f => f.type === MT_TEXT)) || [];

  const [cuId, setCuId] = useState(cus[0]?.id);
  const handleSelectCu  = (e, { value }) => setCuId(value);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const toolbar            = isMobileDevice ? <SourceTabToolbarMobile /> : <SourceTabToolbarWeb />;
  return (
    <div className="player_page_tab">
      <Dropdown
        compact
        inline
        scrolling
        options={cus.map(_cu => ({ text: _cu.name, value: _cu.id }))}
        value={cuId}
        onChange={handleSelectCu}
      />
      <TextLayoutWeb propId={cuId} toolbar={toolbar} />
    </div>
  );
};

export default SourceTab;
