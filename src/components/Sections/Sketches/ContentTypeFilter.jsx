import React from 'react';
import { useSelector } from 'react-redux';

import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import FilterHeader from '../../FiltersAside/FilterHeader';
import { SKETCHES_SHOWED_CTS } from './MainPage';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import { filtersAsideGetTreeSelector } from '../../../redux/selectors';

const ContentTypeFilter = ({ namespace }) => {
  const fetchedCTs = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_CONTENT_TYPE));

  const items = fetchedCTs.filter(ct => SKETCHES_SHOWED_CTS.includes(ct));

  if (isEmpty(items)) return null;
  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.map(x => <ContentTypeItem namespace={namespace} id={x} key={x}/>)
          }
        </>
      }
    />
  );
};

export default ContentTypeFilter;
