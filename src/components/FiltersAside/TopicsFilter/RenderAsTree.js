import { useSelector } from 'react-redux';
import React, { useMemo } from 'react';
import TagSourceItem from './TagSourceItem';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { sourcesAreLoadedSelector, sourcesGetPathByIDSelector, tagsGetPathByIDSelector, sourcesGetRootsSelector, tagsGetRootsSelector } from '../../../redux/selectors';

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
  const getPathTags      = useSelector(tagsGetPathByIDSelector);
  const rootsTags        = useSelector(tagsGetRootsSelector);
  const getPathSources   = useSelector(sourcesGetPathByIDSelector);
  const rootsSources     = useSelector(sourcesGetRootsSelector);
  const areSourcesLoaded = useSelector(sourcesAreLoadedSelector);

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getPath = isTag ? getPathTags : getPathSources;
  const roots   = isTag ? rootsTags : rootsSources;

  const items = useMemo(() => treeItems(baseItems, getPath), [baseItems, areSourcesLoaded, getPath]);

  return (
    <>
      {
        roots
          .filter(r => items.includes(r))
          .map(r =>
            <TagSourceItem id={r} namespace={namespace} baseItems={items} filterName={filterName} deep={1} key={r}/>
          )
      }
    </>
  );
};

export default RenderAsTree;
