import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import ArticleTabToolbarWeb from './ArticleTabToolbarWeb';
import { useSelector } from 'react-redux';
import { selectors as mdb } from '../../../../../../redux/modules/mdb';
import { CT_ARTICLE } from '../../../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../../../helpers/app-contexts';
import ArticleTabToolbarMobile from './ArticleTabToolbarMobile';

const ArticleTab = () => {
  const { id }             = useParams();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const pageCu = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const cu     = Object.values(pageCu.derived_units).find(x => x.content_type === CT_ARTICLE);

  if (!cu) return null;

  const toolbar = isMobileDevice ? <ArticleTabToolbarMobile /> : <ArticleTabToolbarWeb />;

  return (
    <div className="player_page_tab">
      <TextLayoutWeb propId={cu.id} toolbar={toolbar} />
    </div>
  );
};

export default ArticleTab;
