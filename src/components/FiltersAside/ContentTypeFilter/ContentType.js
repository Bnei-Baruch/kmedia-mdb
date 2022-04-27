import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { withNamespaces } from 'react-i18next';
import {
  FN_CONTENT_TYPE,
  UNIT_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE
} from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import FilterHeader from '../FilterHeader';
import ContentTypeItemGroup from './ContentTypeItemGroup';

const groupByName = {
  lessons: { cts: UNIT_LESSONS_TYPE, key: 'lessons', order: 1 },
  events: { cts: UNIT_EVENTS_TYPE, key: 'events', order: 2 },
  programs: { cts: UNIT_PROGRAMS_TYPE, key: 'programs', order: 3 },
  publications: { cts: UNIT_PUBLICATIONS_TYPE, key: 'publications', order: 4 }

};
const cts         = Object.values(groupByName).flatMap(x => x.cts);

const ContentType = ({ namespace, t }) => {
  let items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));
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

export default withNamespaces()(ContentType);
