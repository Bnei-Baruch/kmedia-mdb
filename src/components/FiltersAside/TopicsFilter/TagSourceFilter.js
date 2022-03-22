import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { selectors as tags } from '../../../redux/modules/tags';
import { selectors as sources } from '../../../redux/modules/sources';
import { useMemo } from 'react';
import TagSourceItem from './TagSourceItem';
import { List } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
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

const TagSourceFilter = ({ namespace, filterName, t }) => {
  const baseItems      = useSelector(state => selectors.getTree(state.filtersAside, namespace, filterName));
  const getPathTags    = useSelector(state => tags.getPathByID(state.tags));
  const rootsTags      = useSelector(state => tags.getRoots(state.tags));
  const getPathSources = useSelector(state => sources.getPathByID(state.sources));
  const rootsSources   = useSelector(state => sources.getRoots(state.sources));

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getPath = isTag ? getPathTags : getPathSources;
  const roots   = isTag ? rootsTags : rootsSources;

  const items = useMemo(() => treeItems(baseItems, getPath), [baseItems]);


  return (
    <List>
      <List.Header content={t(`topic.title.${filterName}`)} />
      {
        roots
          .filter(r => items.includes(r))
          .map(r => <TagSourceItem namespace={namespace} id={r} baseItems={items} filterName={filterName} />)
      }
    </List>
  );
};

export default withNamespaces()(TagSourceFilter);
