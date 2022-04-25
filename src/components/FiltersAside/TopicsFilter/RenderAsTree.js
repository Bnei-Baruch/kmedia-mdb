import { useSelector } from 'react-redux';
import { selectors as tags } from '../../../redux/modules/tags';
import { selectors as sources } from '../../../redux/modules/sources';
import React, { useMemo } from 'react';
import TagSourceItem from './TagSourceItem';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';

const treeItems = (items, getPath) => items.map(getPath)
  .flat()
  .filter(x => !!x)
  .reduce((acc, x) => {
    if (!acc.byId[x.id]) {
      acc.byId[x.id] = x.id;
      acc.uniq.push(x.id);
    }

    return acc;
  }, { byId: {}, uniq: [] }).uniq;

const RenderAsTree = ({ namespace, filterName, baseItems }) => {
  const getPathTags      = useSelector(state => tags.getPathByID(state.tags));
  const rootsTags        = useSelector(state => tags.getRoots(state.tags));
  const getPathSources   = useSelector(state => sources.getPathByID(state.sources));
  const rootsSources     = useSelector(state => sources.getRoots(state.sources));
  const areSourcesLoaded = useSelector(state => sources.areSourcesLoaded(state.sources));

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getPath = isTag ? getPathTags : getPathSources;
  const roots   = isTag ? rootsTags : rootsSources;

  const items = useMemo(() => treeItems(baseItems, getPath), [baseItems, areSourcesLoaded]);

  return (
    <>
      {
        roots
          .filter(r => items.includes(r))
          .map(r => <TagSourceItem
              id={r}
              namespace={namespace}
              baseItems={items}
              filterName={filterName}
              deep={1}
              key={r}
            />
          )
      }
    </>
  );
};

export default RenderAsTree;
