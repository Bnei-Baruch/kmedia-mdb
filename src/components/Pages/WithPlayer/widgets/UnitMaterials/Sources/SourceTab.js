import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import { selectors as mdb } from '../../../../../../redux/modules/mdb';
import { selectors as sources } from '../../../../../../redux/modules/sources';
import { MT_TEXT, CT_LIKUTIM, CT_SOURCE } from '../../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import SourceTabToolbarMobile from './SourceTabToolbarMobile';
import SourceTabToolbarWeb from './SourceTabToolbarWeb';
import { isEmpty } from '../../../../../../helpers/utils';

const SourceTab = () => {
  const { id } = useParams();

  const pageCu        = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const getSourceById = useSelector(state => sources.getSourceById(state.sources));

  const dCus = Object.values(pageCu.derived_units)
    .filter(x => [CT_LIKUTIM, CT_SOURCE].includes(x.content_type))
    .filter(x => (x.files || []).some(f => f.type === MT_TEXT)) || [];
  const sCus = Object.values(pageCu.sources).map(getSourceById);
  const cus  = [...dCus, ...sCus];

  const [cuId, setCuId] = useState(cus[0]?.id);

  const handleSelectCu = (e, { value }) => setCuId(value);

  const { isMobileDevice } = useContext(DeviceInfoContext);
  const toolbar            = isMobileDevice ? <SourceTabToolbarMobile /> : <SourceTabToolbarWeb />;

  if (isEmpty(cus)) {
    return <h1>Not found</h1>;
  }

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
