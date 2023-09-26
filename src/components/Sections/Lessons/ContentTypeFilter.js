import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { CT_VIRTUAL_LESSON, FN_CONTENT_TYPE, FN_SHOW_LESSON_AS_UNITS, PAGE_NS_LESSONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import FilterHeader from '../../../../lib/filters/components/FilterHeader';
import CollectionsModal from './CollectionsModal';
import ContentTypeItem from './ContentTypeItem';
import { LESSON_AS_COLLECTION, LESSON_AS_UNIT } from '../../../../pages/lessons';

const ContentTypeFilter = ({ namespace }) => {
  const fetchedCTs = useSelector(state => selectors.getTree(state.filterStats, namespace, FN_CONTENT_TYPE));
  const selected   = useSelector(state => filters.getNotEmptyFilters(state.filters, PAGE_NS_LESSONS), isEqual);

  const items = useMemo(() => {
    const isUnit = selected.some(f => FN_SHOW_LESSON_AS_UNITS.includes(f.name) && !isEmpty(f.values));
    return (isUnit ? LESSON_AS_UNIT : LESSON_AS_COLLECTION).filter(ct => fetchedCTs.includes(ct));
  }, [selected, fetchedCTs]);

  if (isEmpty(items)) return null;
  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.map(x => {
              if (x === CT_VIRTUAL_LESSON) {
                return <CollectionsModal namespace={namespace} ct={CT_VIRTUAL_LESSON} key={x} />;
              }

              return <ContentTypeItem namespace={namespace} id={x} key={x} />;
            })
          }
        </>
      }
    />
  );
};

export default ContentTypeFilter;
