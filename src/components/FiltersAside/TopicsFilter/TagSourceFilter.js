import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import React, { useState } from 'react';
import { withNamespaces } from 'react-i18next';
import RenderAsList from './RenderAsList';
import RenderAsTree from './RenderAsTree';
import FilterHeader from '../FilterHeader';
import { Input } from 'semantic-ui-react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';

const TagSourceFilter = ({ namespace, filterName, t }) => {
  const [query, setQuery] = useState();
  const baseItems         = useSelector(state => selectors.getTree(state.filtersAside, namespace, filterName));

  if (!(baseItems?.length > 0)) return null;

  const handleSetQuery = (e, data) => setQuery(data.value);

  const isTag = filterName === FN_TOPICS_MULTI;
  return (
    <FilterHeader
      filterName={filterName}
      children={
        <>
          <Input
            className="search-input"
            placeholder={t(`filters.aside-filter.search-input-${isTag ? 'topic' : 'source'}`)}
            onChange={handleSetQuery}
            value={query}
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

export default withNamespaces()(TagSourceFilter);
