import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import React, { useState } from 'react';
import { List } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import RenderAsList from './RenderAsList';
import RenderAsTree from './RenderAsTree';
import SearchInput from '../../Filters/SearchInput';

const TagSourceFilter = ({ namespace, filterName, t }) => {
  const [query, setQuery] = useState();
  const baseItems         = useSelector(state => selectors.getTree(state.filtersAside, namespace, filterName));

  const handleSetQuery = (e, data) => {
    const q = data.value.trim();
    q && setQuery(q);
  };

  return (
    <List className="filter_aside">

      <SearchInput onSearch={handleSetQuery} onClear={() => setQuery(null)} />
      <List.Header className="title" content={t(`filters.aside-filter.${filterName}`)} />
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
    </List>
  );
};

export default withNamespaces()(TagSourceFilter);
