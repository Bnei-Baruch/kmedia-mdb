import { useSelector } from 'react-redux';
import { selectors as tags } from '../../../redux/slices/tagsSlice/tagsSlice';
import { selectors as sources } from '../../../redux/slices/sourcesSlice/sourcesSlice';
import React, { useMemo } from 'react';
import { FN_TOPICS_MULTI } from '../../../../src/helpers/consts';
import TagSourceItem from './TagSourceItem';

const RenderAsList = ({ namespace, filterName, baseItems, query }) => {
  const getTagById    = useSelector(state => tags.getTagById(state.tags));
  const getSourceById = useSelector(state => sources.getSourceById(state.sources));

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getById = isTag ? getTagById : getSourceById;
  const field   = isTag ? 'label' : 'name';

  const items = useMemo(() => baseItems.filter(id => {
    const reg = new RegExp(query, 'i');
    const n   = getById(id)?.[field];
    return n && reg.test(n);
  }), [baseItems, query, field, getById]);

  return (
    <>
      {
        items?.map(r => <TagSourceItem
          key={r}
          id={r}
          namespace={namespace}
          baseItems={items}
          filterName={filterName}
        />)
      }
    </>
  );
};

export default RenderAsList;