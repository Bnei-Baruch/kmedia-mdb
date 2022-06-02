import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  CT_LECTURE,
  CT_LESSON_PART,
  CT_LESSONS_SERIES,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  FN_CONTENT_TYPE
} from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/filtersAside';
import ContentTypeItem from '../../FiltersAside/ContentTypeFilter/ContentTypeItem';
import FilterHeader from '../../FiltersAside/FilterHeader';
import CollectionsModal from './CollectionsModal';

const SHOWED_CT = [CT_LESSON_PART, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, CT_LECTURE, CT_LESSONS_SERIES];

const ContentTypeFilter = ({ namespace, t }) => {
  const fetchedCTs = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_CONTENT_TYPE));
  const items      = SHOWED_CT.filter(ct => fetchedCTs.includes(ct));

  if (isEmpty(items)) return null;
  return (
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={
        <>
          {
            items.map(x => {
              if (x === CT_VIRTUAL_LESSON) {
                return <CollectionsModal namespace={namespace} ct={CT_VIRTUAL_LESSON} />;
              }

              return <ContentTypeItem namespace={namespace} id={x} key={x} />;
            })
          }
        </>
      }
    />
  );
};

export default withNamespaces()(ContentTypeFilter);
