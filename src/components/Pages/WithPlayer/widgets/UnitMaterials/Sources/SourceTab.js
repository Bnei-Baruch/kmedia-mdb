import React, { useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import { isEmpty } from '../../../../../../helpers/utils';
import { MT_TEXT, CT_LIKUTIM, CT_SOURCE } from '../../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import SourceTabToolbarMobile from './SourceTabToolbarMobile';
import SourceTabToolbarWeb from './SourceTabToolbarWeb';
import { mdbGetDenormContentUnitSelector, sourcesGetSourceByIdSelector } from '../../../../../../redux/selectors';
import { canonicalLink } from '../../../../../../helpers/links';
import { useInitTextUrl } from '../../../../WithText/hooks/useInitTextUrl';
import TextLayoutMobile from '../../../../WithText/TextLayoutMobile';

const SourceTab = () => {
  const { id } = useParams();

  const pageCu        = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const getSourceById = useSelector(state => sourcesGetSourceByIdSelector(state));

  const dCus = Object.values(pageCu.derived_units)
    .filter(x => [CT_LIKUTIM, CT_SOURCE].includes(x.content_type))
    .filter(x => (x.files || []).some(f => f.type === MT_TEXT)) || [];
  const sCus = Object.values(pageCu.sources).map(getSourceById);
  const cus  = [...dCus, ...sCus];

  const [cuId, setCuId] = useState(cus[0]?.id);

  const cu       = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId));
  const pathname = canonicalLink(cu).pathname.slice(1);

  const linkMemo = useMemo(() => ({ pathname, search: {} }), [pathname]);
  useInitTextUrl(linkMemo);

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
      {
        isMobileDevice ? (
          <TextLayoutMobile toolbar={toolbar} playerPage={true} />
        ) : (
          <TextLayoutWeb toolbar={toolbar} playerPage={true} />
        )
      }
    </div>
  );
};

export default SourceTab;
