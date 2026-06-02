import React, { useContext, useMemo, useState, useCallback } from 'react';
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
import { isEmpty } from '../../../../../../helpers/utils';
import PageWithPlayerTOC from '../PageWithPlayerTOC';

const ArticleTab = ({ id }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const cus    = Object.values(pageCu.derived_units).filter(x => x.content_type === CT_ARTICLE);

  const [selectedId, setSelectedId] = useState(cus[0]?.id);

  const selected = cus.find(cu => cu.id === selectedId);

  const pathname = canonicalLink(selected).pathname.slice(1);
  const linkMemo = useMemo(() => ({ pathname, search: {} }), [pathname]);
  useInitTextUrl(linkMemo);
  const handleSelectCu = useCallback(id => setSelectedId(id), [setSelectedId]);

  if (isEmpty(cus)) return <NotFound textKey="materials.articles.no-content"/>;

  return (
    <div className="player_page_tab">
      {
        isMobileDevice ? (
          <TextLayoutMobile
            toolbar={<ArticleTabToolbarMobile hasToc={cus.length > 1}/>}
            playerPage={true}
            id={selectedId}
            toc={
              <PageWithPlayerTOC
                cus={cus}
                onClick={handleSelectCu}
              />
            }
          />
        ) : (
          <TextLayoutWeb
            toolbar={<ArticleTabToolbarWeb hasToc={cus.length > 1}/>}
            playerPage={true}
            id={selectedId}
            toc={
              <PageWithPlayerTOC
                cus={cus}
                onClick={handleSelectCu}
                textKey="article-toc"
              />
            }
          />
        )
      }
    </div>
  );
};

export default ArticleTab;
