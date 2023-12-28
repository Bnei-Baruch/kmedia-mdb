import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import { selectors as mdb } from '../../../../../../redux/modules/mdb';
import { MT_TEXT, CT_LIKUTIM, CT_SOURCE } from '../../../../../../helpers/consts';

const Transcription = () => {
  let { id } = useParams();

  const pageCu = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const cus    = Object.values(pageCu.derived_units)
    .filter(x => [CT_LIKUTIM, CT_SOURCE].includes(x.content_type))
    .filter(x => (x.files || []).some(f => f.type === MT_TEXT)) || [];

  const [cuId, setCuId] = useState(cus[0]?.id);
  const handleSelectCu  = (e, { value }) => setCuId(value);

  return (
    <div>
      <Dropdown
        compact
        inline
        scrolling
        options={cus.map(_cu => ({ text: _cu.name, value: _cu.id }))}
        value={cuId}
        onChange={handleSelectCu}
      />
      <TextLayoutWeb propId={cuId} />
    </div>
  );
};

export default Transcription;
