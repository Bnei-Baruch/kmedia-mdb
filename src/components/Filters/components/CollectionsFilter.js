import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CT_ARTICLES, CT_CLIPS, CT_LECTURE_SERIES, CT_VIDEO_PROGRAM, CT_VIRTUAL_LESSONS } from '../../../helpers/consts';
import { strCmp } from '../../../helpers/utils';
import { selectors as lessons } from '../../../redux/modules/lessons';
import { selectors as programs } from '../../../redux/modules/programs';
import { selectors as publications } from '../../../redux/modules/publications';
import { selectors as mdb } from '../../../redux/modules/mdb';
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

const CollectionsFilter = (props) => {
  const { t }         = useTranslation('common', { useSuspense: false });
  const { namespace } = props;
  const collections   = useSelector(state => {
    let ct;
    let cIDs;

    switch (namespace) {
    case 'lessons-virtual':
      ct   = CT_VIRTUAL_LESSONS;
      cIDs = lessons.getLecturesByType(state.lessons)[ct];
      break;
    case 'lessons-lectures':
      ct   = CT_LECTURE_SERIES;
      cIDs = lessons.getLecturesByType(state.lessons)[ct];
      break;
    case 'programs-main':
      ct   = CT_VIDEO_PROGRAM;
      cIDs = programs.getProgramsByType(state.programs)[ct];
      break;
    case 'programs-clips':
      ct   = CT_CLIPS;
      cIDs = programs.getProgramsByType(state.programs)[ct];
      break;
    case 'publications-articles':
      ct   = CT_ARTICLES;
      cIDs = publications.getCollections(state.publications)[ct];
      break;
    default:
      break;
    }
    const collections = (cIDs || []).map(x => mdb.getCollectionById(state.mdb, x));
    return getTree(collections, t);
  });

  return <HierarchicalFilter name="collections-filter" tree={collections} {...props} t={t} />;
};

export default CollectionsFilter;
