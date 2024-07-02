import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  CT_VIRTUAL_LESSON,
  FN_CONTENT_TYPE,
  FN_SHOW_LESSON_AS_UNITS,
  PAGE_NS_LESSONS,
  CT_LESSONS,
  CT_VIRTUAL_LESSONS
} from '../../../../helpers/consts';
import { isEmpty } from '../../../../helpers/utils';
import FilterHeader from '../../../FiltersAside/FilterHeader';
import ContentTypeItem from './ContentTypeItem';
import { LESSON_AS_COLLECTION, LESSON_AS_UNIT } from '../MainPage';
import { filtersAsideGetTreeSelector, filtersGetNotEmptyFiltersSelector } from '../../../../redux/selectors';
import PartOfDayFilterModal from './PartOfDayFilterModal';
import CollectionsByCtBtn from '../../../FiltersAside/CollectionsByCt/CollectionsByCtBtn';

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
            items.map(ct => {
              if (ct === CT_VIRTUAL_LESSON) {
                return <CollectionsByCtBtn namespace={namespace} key={ct} ct={CT_VIRTUAL_LESSONS}/>;
              }

              if (CT_LESSONS.includes(ct)) {
                return <PartOfDayFilterModal namespace={namespace} ct={ct} key={ct}/>;
              }

              return <ContentTypeItem namespace={namespace} id={ct} key={ct}/>;
            })
          }
        </>
      }
    />
  );
};

export default ContentTypeFilter;
