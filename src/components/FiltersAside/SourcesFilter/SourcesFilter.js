import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { selectors as sources } from '../../../redux/modules/sources';
import { FN_SOURCES_MULTI } from '../../../helpers/consts';
import { useMemo } from 'react';
import SourcesItem from './SourcesItem';
import { List } from 'semantic-ui-react';

const treeItems = (items, getPath) => {
  return items.map(getPath)
    .flat()
    .filter(x => !!x)
    .reduce((acc, x) => {
      if (!acc.byId[x.id]) {
        acc.byId[x.id] = x.id;
        acc.uniq.push(x.id);
      }
      return acc;
    }, { byId: {}, uniq: [] }).uniq;
};

const SourcesFilter = ({ namespace }) => {
  const baseItems = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_SOURCES_MULTI));
  const getPath   = useSelector(state => sources.getPathByID(state.sources));
  const roots     = useSelector(state => sources.getRoots(state.sources));

  const items = useMemo(() => treeItems(baseItems, getPath), [baseItems]);

  return (
    <List>
      {
        roots
          .filter(r => items.includes(r))
          .map(r => <SourcesItem namespace={namespace} id={r} baseItems={items} />)
      }
    </List>
  );
};

export default SourcesFilter;
