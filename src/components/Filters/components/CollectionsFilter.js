import React from 'react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';

import { CT_ARTICLES } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors as publications } from '../../../../lib/redux/slices/publicationsSlice/thunks';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';
import HierarchicalFilter from './HierarchicalFilter';

const getTree = (collections, t) => {
  collections.sort((a, b) => strCmp(a.name, b.name));

  return [
    {
      value: 'root',
      text: t('filters.collections-filter.all'),
      children: collections.map(x => ({
        text: x.name,
        value: x.id,
      }))
    }
  ];
};

const mapNS2Tree = (state, namespace, t) => {
  let ct;
  let cIDs;

  switch (namespace) {
    case 'publications-articles':
      ct   = CT_ARTICLES;
      cIDs = publications.getCollections(state.publications)[ct];
      break;
    default:
      break;
  }

  const collections = (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x));
  return getTree(collections, t);
};

const CollectionsFilter = props => {
  const { t }         = useTranslation();
  const { namespace } = props;
  const tree          = useSelector(state => mapNS2Tree(state, namespace, t));

  return <HierarchicalFilter name="collections-filter" tree={tree} {...props} t={t} />;
};

export default CollectionsFilter;
