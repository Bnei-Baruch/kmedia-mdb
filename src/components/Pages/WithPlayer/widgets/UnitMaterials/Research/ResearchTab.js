import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import ResearchTabToolbarWeb from './ResearchTabToolbarWeb';
import { useSelector } from 'react-redux';
import { CT_RESEARCH_MATERIAL } from '../../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import ResearchTabToolbarMobile from './ResearchTabToolbarMobile';
import { mdbGetDenormContentUnitSelector } from '../../../../../../redux/selectors';
import { canonicalLink } from '../../../../../../helpers/links';
import { useInitTextUrl } from '../../../../WithText/hooks/useInitTextUrl';
import TextLayoutMobile from '../../../../WithText/TextLayoutMobile';
import NotFound from '../../../../../shared/NotFound';

const ResearchTab = ({ id }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const cu     = Object.values(pageCu.derived_units).find(x => x.content_type === CT_RESEARCH_MATERIAL);

  const pathname = canonicalLink(cu).pathname.slice(1);

  const linkMemo = useMemo(() => ({ pathname, search: { activeTab: 'research' } }), [pathname]);
  useInitTextUrl(linkMemo);

  if (!cu) return <NotFound textKey="materials.research.no-content"/>;

  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile toolbar={<ResearchTabToolbarMobile />} playerPage={true} id={cu.id} />
        ) : (
          <TextLayoutWeb toolbar={<ResearchTabToolbarWeb />} playerPage={true} id={cu.id} />
        )
      }
    </div>
  );
};

export default ResearchTab;
