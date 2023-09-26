import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { withTranslation } from 'next-i18next';
import {
  CT_LESSONS_SERIES,
  CT_SOURCE,
  FN_CONTENT_TYPE,
  UNIT_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE
} from '../../../../src/helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import FilterHeader from '../FilterHeader';
import ContentTypeItemGroup from './ContentTypeItemGroup';

const groupByName = {
  lessons: { cts: [CT_LESSONS_SERIES, ...UNIT_LESSONS_TYPE], key: 'lessons', order: 2 },
  events: { cts: UNIT_EVENTS_TYPE, key: 'events', order: 3 },
  programs: { cts: UNIT_PROGRAMS_TYPE, key: 'programs', order: 4 },
  publications: { cts: UNIT_PUBLICATIONS_TYPE, key: 'publications', order: 5 },
  sources: { cts: [CT_SOURCE], key: 'sources', order: 1 },
};
const cts = Object.values(groupByName).flatMap(x => x.cts);

const ContentType = ({ namespace, t }) => {
  let items = useSelector(state => selectors.getTree(state.filterStats, namespace, FN_CONTENT_TYPE));
  items     = items.filter(ct => !cts.includes(ct));

  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            Object.values(groupByName)
              .sort((g1, g2) => g1.order - g2.order)
              .map(g => <ContentTypeItemGroup group={g} namespace={namespace} key={g.key} />)
          }
          {items.map(id => <ContentTypeItem namespace={namespace} id={id} key={id} />)}
        </>
      }
    />
  );
};

export default withTranslation()(ContentType);
