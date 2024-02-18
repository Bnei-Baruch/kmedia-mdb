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
import NotFound from '../../../../../shared/NotFound';

const ArticleTab = ({id}) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const cu     = Object.values(pageCu.derived_units).find(x => x.content_type === CT_ARTICLE);

  const pathname = canonicalLink(cu).pathname.slice(1);
  const linkMemo = useMemo(() => ({ pathname, search: {} }), [pathname]);
  useInitTextUrl(linkMemo);

  if (!cu) return <NotFound  textKey="materials.articles.no-content"/>;

  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile toolbar={<ArticleTabToolbarMobile />} playerPage={true} id={cu.id} />
        ) : (
          <TextLayoutWeb toolbar={<ArticleTabToolbarWeb />} playerPage={true} id={cu.id} />
        )
      }
    </div>
  );
};

export default ArticleTab;
