import React, { useState, useContext, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
import NotFound from '../../../../../shared/NotFound';
import SourceTabTOC from './SourceTabTOC';

const SourceTab = () => {
  const { id } = useParams();

  const pageCu        = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const getSourceById = useSelector(state => sourcesGetSourceByIdSelector(state));

  const dCus = Object.values(pageCu.derived_units)
    .filter(x => [CT_LIKUTIM, CT_SOURCE].includes(x.content_type))
    .filter(x => (x.files || []).some(f => f.type === MT_TEXT)) || [];
  const sCus = Object.values(pageCu?.sources || {}).map(getSourceById);
  const cus  = [...dCus, ...sCus];

  const [cuId, setCuId] = useState(cus[0]?.id);

  const cu       = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId));
  const pathname = canonicalLink(cu).pathname.slice(1);

  const linkMemo = useMemo(() => ({ pathname, search: {} }), [pathname]);
  useInitTextUrl(linkMemo);

  const handleSelectCu = useCallback(id => setCuId(id), [setCuId]);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  if (isEmpty(cus)) return <NotFound />;

  const toc = <SourceTabTOC cus={cus} onClick={handleSelectCu} />;
  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile
            id={cu.id}
            toc={toc}
            toolbar={<SourceTabToolbarMobile needTOC={cus.length > 1} />}
            playerPage={true}
          />
        ) : (
          <TextLayoutWeb
            id={cu.id}
            toc={toc}
            toolbar={<SourceTabToolbarWeb needTOC={cus.length > 1} />}
            playerPage={true}
          />
        )
      }
    </div>
  );
};

export default SourceTab;
