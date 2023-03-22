import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import RenderAsList from './RenderAsList';
import RenderAsTree from './RenderAsTree';
import FilterHeader from '../FilterHeader';
import { Input } from 'semantic-ui-react';

const TagSourceFilter = ({ namespace, filterName, t }) => {
  const [query, setQuery] = useState();
  const baseItems         = useSelector(state => selectors.getTree(state.filtersAside, namespace, filterName));

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

export default withTranslation()(TagSourceFilter);
