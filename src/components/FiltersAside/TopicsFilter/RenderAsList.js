import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import TagSourceItem from './TagSourceItem';
import { sourcesGetSourceByIdSelector, tagsGetTagByIdSelector } from '../../../redux/selectors';

const RenderAsList = ({ namespace, filterName, baseItems, query }) => {
  const getTagById    = useSelector(tagsGetTagByIdSelector);
  const getSourceById = useSelector(sourcesGetSourceByIdSelector);

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
