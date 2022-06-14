import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import { EVENT_PAGE_CTS, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/filtersAside';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../FiltersAside/FilterHeader';

const ContentTypeFilter = ({ namespace }) => {
  const items = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));

  if (isEmpty(items))
    return null;

  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.filter(x => EVENT_PAGE_CTS.includes(x))
              .map(x => <ContentTypeItem namespace={namespace} id={x} key={x} />)
          }
        </>
      }
    />
  );
};

export default withNamespaces()(ContentTypeFilter);
