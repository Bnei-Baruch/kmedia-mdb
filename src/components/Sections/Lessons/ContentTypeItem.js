'use client';

import React from 'react';
import { withTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { CT_LESSONS, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { selectors as filtersAside } from '../../../../lib/redux/slices/filterSlice/filterStatsSlice';
import { definitionsByName } from '../../../../lib/filters/transformer';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { updateFiltersSearchParams } from '../../../../lib/filters/helper';

const ContentTypeItem = ({ namespace, id, isSelChild = false, t }) => {
  const filterName = FN_CONTENT_TYPE;

  const stat         = useSelector(state => filtersAside.getStats(state.filterStats, namespace, filterName)(id));
  const searchParams = useSearchParams();
  const router       = useRouter();

  const handleSelect = (e, { checked }) => {
    const query = updateFiltersSearchParams(id, checked, filterName, searchParams);
    router.push({ query }, undefined, { scroll: false });
  };

  const selected = searchParams.getAll(definitionsByName[filterName].queryKey);
  const isLesson = CT_LESSONS.includes(id);
  const isSel    = isLesson ? selected.some(id => CT_LESSONS.includes(id)) : selected.includes(id);

  return (
    <List.Item key={`${filterName}_${id}`} disabled={stat === 0} className="filters-aside-ct">
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
