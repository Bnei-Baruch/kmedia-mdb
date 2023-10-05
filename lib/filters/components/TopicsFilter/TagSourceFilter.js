import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/slices/filterSlice/filterStatsSlice';
import React, { useState } from 'react';
import { withTranslation, useTranslation } from 'next-i18next';
import RenderAsList from './RenderAsList';
import RenderAsTree from './RenderAsTree';
import FilterHeader from '../FilterHeader';
import { Input } from 'semantic-ui-react';

const TagSourceFilter = ({ namespace, filterName }) => {
  const { t }             = useTranslation();
  const [query, setQuery] = useState();
  const baseItems         = useSelector(state => selectors.getTree(state.filterStats, namespace, filterName));

  if (!(baseItems?.length > 0)) return null;

  const handleSetQuery = (e, data) => setQuery(data.value);

  return (
    <FilterHeader
      filterName={filterName}
      children={
        <>
          <Input
            className="search-input"
            placeholder={t('sources-library.filter')}
            onChange={handleSetQuery}
            defaultValue={query}
          />
          {
            query ? <RenderAsList
              query={query}
              namespace={namespace}
              baseItems={baseItems}
              filterName={filterName}
            /> : <RenderAsTree
              namespace={namespace}
              baseItems={baseItems}
              filterName={filterName}
            />
          }
        </>
      }
    />
  );
};

export default TagSourceFilter;
