import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import ResearchTabToolbarWeb from './ResearchTabToolbarWeb';
import { useSelector } from 'react-redux';
import { CT_RESEARCH_MATERIAL } from '../../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import ResearchTabToolbarMobile from './ResearchTabToolbarMobile';
import { mdbGetDenormContentUnitSelector } from '../../../../../../redux/selectors';

const ResearchTab = () => {
  const { id } = useParams();

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu = useSelector(state => mdbGetDenormContentUnitSelector(state.mdb, id));
  const cu     = Object.values(pageCu.derived_units).find(x => x.content_type === CT_RESEARCH_MATERIAL);

  if (!cu) return null;

  const toolbar = isMobileDevice ? <ResearchTabToolbarMobile /> : <ResearchTabToolbarWeb />;

  return (
    <div className="player_page_tab">
      <TextLayoutWeb propId={cu.id} toolbar={toolbar} playerPage={true} />
    </div>
  );
};

export default ResearchTab;
