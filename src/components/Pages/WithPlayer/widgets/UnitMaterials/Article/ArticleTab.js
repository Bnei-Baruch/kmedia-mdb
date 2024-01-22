import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import ArticleTabToolbarWeb from './ArticleTabToolbarWeb';
import { CT_ARTICLE } from '../../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import ArticleTabToolbarMobile from './ArticleTabToolbarMobile';
import { mdbGetDenormContentUnitSelector } from '../../../../../../redux/selectors';
import { useInitTextUrl } from '../../../../WithText/hooks/useInitTextUrl';
import { canonicalLink } from '../../../../../../helpers/links';
import TextLayoutMobile from '../../../../WithText/TextLayoutMobile';

const ArticleTab = () => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const cu     = Object.values(pageCu.derived_units).find(x => x.content_type === CT_ARTICLE);

  const pathname = canonicalLink(cu).pathname.slice(1);
  const linkMemo = useMemo(() => ({ pathname, search: {} }), [pathname]);
  useInitTextUrl(linkMemo);

  if (!cu) return null;

  const toolbar = isMobileDevice ? <ArticleTabToolbarMobile /> : <ArticleTabToolbarWeb />;

  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile toolbar={toolbar} playerPage={true} id={cu.id} />
        ) : (
          <TextLayoutWeb toolbar={toolbar} playerPage={true} id={cu.id} />
        )
      }
    </div>
  );
};

export default ArticleTab;
