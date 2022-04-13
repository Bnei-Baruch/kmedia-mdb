import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import RenderAsTree from '../../FiltersAside/TopicsFilter/RenderAsTree';
import { selectors as tags } from '../../../redux/modules/tags';
import { List } from 'semantic-ui-react';

const getItemsRecursive = (rootID, getById, base) => {
  const root = getById(rootID);
  if (!root.children || root.children.length === 0) {
    return [rootID];
  }

  const ch = root
    .children
    .filter(x => base.includes(x))
    .map(x => getItemsRecursive(x, getById, base))
    .flat();

  return ch;
};

const SubTopics = ({ namespace, root }) => {
  const getTagById = useSelector(state => tags.getTagById(state.tags));
  const baseItems  = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_TOPICS_MULTI));

  const tagItems = getItemsRecursive(root, getTagById, baseItems) || [];

  return (
    <List>
      <RenderAsTree
        namespace={namespace}
        filterName={FN_TOPICS_MULTI}
        baseItems={tagItems}
        rootIDs={[root]}
      />
    </List>

  );
};

export default SubTopics;
