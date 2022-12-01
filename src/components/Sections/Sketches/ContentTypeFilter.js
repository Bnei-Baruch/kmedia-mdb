import { isEqual } from 'lodash';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FN_CONTENT_TYPE, PAGE_NS_LESSONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors as filters } from '../../../redux/modules/filters';
import { selectors } from '../../../redux/modules/filtersAside';
import FilterHeader from '../../FiltersAside/FilterHeader';
import { SKETCHES_SHOWED_CTS } from './MainPage';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';

const ContentTypeFilter = ({ namespace }) => {
  const fetchedCTs = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));
  const selected   = useSelector(state => filters.getNotEmptyFilters(state.filters, PAGE_NS_LESSONS), isEqual);

  const items = useMemo(() => fetchedCTs.filter(ct => SKETCHES_SHOWED_CTS.includes(ct)),
    [selected, fetchedCTs]);

  if (isEmpty(items)) return null;
  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.map(x => <ContentTypeItem namespace={namespace} id={x} key={x} />)
          }
        </>
      }
    />
  );
};

export default ContentTypeFilter;
