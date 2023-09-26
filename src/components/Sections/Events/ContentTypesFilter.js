import React from 'react';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { CT_HOLIDAY, EVENT_PAGE_CTS, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { selectors } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import ContentTypeItem from '../../../../lib/filters/FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../../../lib/filters/FiltersAside/FilterHeader';
import Holidays from './Holidays';

const ContentTypesFilter = ({ namespace, t }) => {
  const items = useSelector(state => selectors
    .getTree(state.filterStats, namespace, FN_CONTENT_TYPE)
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

export default withTranslation()(ContentTypesFilter);
