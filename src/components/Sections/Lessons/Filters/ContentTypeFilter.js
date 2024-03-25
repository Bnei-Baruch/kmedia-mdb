import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  CT_VIRTUAL_LESSON,
  FN_CONTENT_TYPE,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_LESSONS,
  CT_LESSONS
} from '../../../../helpers/consts';
import { isEmpty } from '../../../../helpers/utils';
import FilterHeader from '../../../FiltersAside/FilterHeader';
import CollectionsModal from './CollectionsModal';
import ContentTypeItem from './ContentTypeItem';
import { LESSON_AS_COLLECTION, LESSON_AS_UNIT } from '../MainPage';
import { filtersAsideGetTreeSelector, filtersGetNotEmptyFiltersSelector } from '../../../../redux/selectors';
import PartOfDayFilterModal from './PartOfDayFilterModal';

const ContentTypeFilter = ({ namespace }) => {
  const fetchedCTs = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_CONTENT_TYPE));
  const selected   = useSelector(state => filtersGetNotEmptyFiltersSelector(state, PAGE_NS_LESSONS), isEqual);

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
                return <CollectionsModal namespace={namespace} ct={CT_VIRTUAL_LESSON} key={x}/>;
              }

              if (CT_LESSONS.includes(x)) {
                return <PartOfDayFilterModal namespace={namespace} ct={x} key={x}/>;
              }

              return <ContentTypeItem namespace={namespace} id={x} key={x}/>;
            })
          }
        </>
      }
    />
  );
};

export default ContentTypeFilter;
