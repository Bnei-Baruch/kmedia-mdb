import { useSelector } from 'react-redux';
import { selectors as tags } from '../../../redux/modules/tags';
import { selectors as sources } from '../../../redux/modules/sources';
import React, { useMemo } from 'react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import TagSourceItem from './TagSourceItem';

const RenderAsList = ({ namespace, filterName, t, baseItems, query }) => {
  const getTagById    = useSelector(state => tags.getTagById(state.tags));
  const getSourceById = useSelector(state => sources.getSourceById(state.sources));

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getById = isTag ? getTagById : getSourceById;
  const field   = isTag ? 'label' : 'name';
  const reg     = new RegExp(query, 'i');

  const items   = useMemo(() => baseItems.filter(id => {
    const n = getById(id)?.[field];
    return n && reg.test(n);
  }), [baseItems, query]);

  return (
    <>
      {
        items?.map(r => <TagSourceItem
            id={r}
            namespace={namespace}
            baseItems={items}
            filterName={filterName}
          />
        )
      }
    </>
  );
};

export default RenderAsList;
