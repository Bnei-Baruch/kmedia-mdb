'use client';

import React from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { CT_LESSONS, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { filterSlice, selectors as filters } from '../../../../lib/redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import filtersTransformer, { definitionsByName, filterValuesToQueryValues } from '../../../../lib/filters/transformer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { isEmpty } from '../../../helpers/utils';
import { updateFiltersSearchParams } from '../../../../lib/filters/helper';

const ContentTypeItem = ({ namespace, id, isSelChild = false, t }) => {
  const isLesson = CT_LESSONS.includes(id);

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE) || []);
  const stat     = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_CONTENT_TYPE)(id));

  const searchParams = useSearchParams();
  const router       = useRouter();
  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, FN_CONTENT_TYPE, searchParams);
    router.push({ query });
  };

  const isSel = isLesson ? selected.some(id => CT_LESSONS.includes(id)) : selected.includes(id);

  return (
    <List.Item key={`${FN_CONTENT_TYPE}_${id}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.content-types.${id}`)}
        checked={isSel}
        onChange={handleSelect}
        indeterminate={isSelChild}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withTranslation()(ContentTypeItem);
