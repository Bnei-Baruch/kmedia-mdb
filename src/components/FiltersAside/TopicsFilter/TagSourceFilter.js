import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import RenderAsList from './RenderAsList';
import RenderAsTree from './RenderAsTree';
import SearchInput from '../../Filters/SearchInput';
import { FN_LANGUAGES } from '../../../helpers/consts';
import FilterHeader from '../FilterHeader';

const TagSourceFilter = ({ namespace, filterName, t }) => {
  const [query, setQuery] = useState();
  const baseItems         = useSelector(state => selectors.getTree(state.filtersAside, namespace, filterName));

  const handleSetQuery = (e, data) => {
    const q = data.value.trim();
    q && setQuery(q);
  };

  return (
    <FilterHeader
      filterName={filterName}
      children={
        <>
          <SearchInput onSearch={handleSetQuery} onClear={() => setQuery(null)} />
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

export default withNamespaces()(TagSourceFilter);
