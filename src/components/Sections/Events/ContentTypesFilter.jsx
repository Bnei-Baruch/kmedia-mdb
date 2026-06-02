import React from 'react';
import { useSelector } from 'react-redux';
import { CT_HOLIDAY, EVENT_PAGE_CTS, FN_CONTENT_TYPE, CT_PUBLIC_EVENTS } from '../../../helpers/consts';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../FiltersAside/FilterHeader';
import { filtersAsideGetTreeSelector } from '../../../redux/selectors';
import CollectionsByCtBtn from '../../FiltersAside/CollectionsByCt/CollectionsByCtBtn';

const ContentTypesFilter = ({ namespace }) => {
  const filter_cts = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_CONTENT_TYPE));
  //use custom order
  const items   = EVENT_PAGE_CTS.filter(ct => filter_cts.includes(ct));

  return (<>
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.map(ct => {
              if (ct === CT_HOLIDAY) {
                return <CollectionsByCtBtn namespace={namespace} key={ct} ct={ct}/>;
              }

              if (ct === CT_PUBLIC_EVENTS) {
                return <CollectionsByCtBtn namespace={namespace} key={ct} ct={ct}/>;
              }

              return <ContentTypeItem namespace={namespace} id={ct} key={ct}/>;
            })
          }
        </>
      }
    />
  </>);
};

export default ContentTypesFilter;
