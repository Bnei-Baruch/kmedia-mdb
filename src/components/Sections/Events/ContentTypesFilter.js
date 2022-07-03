import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CT_HOLIDAY, EVENT_PAGE_CTS, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/filtersAside';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../FiltersAside/FilterHeader';
import Holidays from './Holidays';

const ContentTypesFilter = ({ namespace, t }) => {
  const items = useSelector(state => selectors
    .getTree(state.filtersAside, namespace, FN_CONTENT_TYPE)
    .filter(ct => EVENT_PAGE_CTS.includes(ct))
  );

  return (<>
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.map(ct => {
              if (ct === CT_HOLIDAY) {
                return <Holidays namespace={namespace} key={ct} />;
              }
              return <ContentTypeItem namespace={namespace} id={ct} key={ct} />;
            })
          }
        </>
      }
    />
  </>);
};

export default withNamespaces()(ContentTypesFilter);
