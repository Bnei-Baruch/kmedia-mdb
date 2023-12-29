import React from 'react';
import { useParams } from 'react-router-dom';

import TextLayoutWeb from '../../../../WithText/TextLayoutWeb';
import ArticleTabToolbarWeb from './ArticleTabToolbarWeb';
import { useSelector } from 'react-redux';
import { selectors as mdb } from '../../../../../../redux/modules/mdb';
import { CT_LIKUTIM, CT_SOURCE, MT_TEXT, CT_ARTICLE } from '../../../../../../helpers/consts';

const ArticleTab = () => {
  const { id } = useParams();

  const pageCu = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const cu     = Object.values(pageCu.derived_units).find(x => x.content_type === CT_ARTICLE);

  if (!cu) return null;

  const toolbar = <ArticleTabToolbarWeb />;

  return (
    <div className="transition_tab">
      <TextLayoutWeb propId={cu.id} toolbar={toolbar} />
    </div>
  );
};

export default ArticleTab;
