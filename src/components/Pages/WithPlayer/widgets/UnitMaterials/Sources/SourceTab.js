import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
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

const SourceTab = ({ id }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu        = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const getSourceById = useSelector(state => sourcesGetSourceByIdSelector(state));

  const dCus    = Object.values(pageCu.derived_units)
    .filter(x => [CT_LIKUTIM, CT_SOURCE].includes(x.content_type))
    .filter(x => (x.files || []).some(f => f.type === MT_TEXT)) || [];
  const sources = Object.values(pageCu?.sources || {}).map(getSourceById).map(x => ({ ...x, content_type: CT_SOURCE }));

  const subjects                  = [...sources, ...dCus];
  const subject                   = subjects[0];
  const [subjectId, setSubjectId] = useState(subject?.id);

  const pathname = canonicalLink(subject).pathname.slice(1);

  const linkMemo = useMemo(() => ({ pathname, search: {} }), [pathname]);
  useInitTextUrl(linkMemo);

  const handleSelectCu = useCallback(id => setSubjectId(id), [setSubjectId]);

  useEffect(() => {
    setSubjectId(subject?.id);
  }, [subject?.id]);

  if (!subject) return <NotFound textKey="materials.sources.no-sources" />;

  const toc = <SourceTabTOC cus={subjects} onClick={handleSelectCu} />;
  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile
            id={subjectId}
            toolbar={<SourceTabToolbarMobile toc={toc} />}
            playerPage={true}
          />
        ) : (
          <TextLayoutWeb
            id={subjectId}
            toolbar={<SourceTabToolbarWeb toc={toc} />}
            playerPage={true}
          />
        )
      }
    </div>
  );
};

export default SourceTab;
