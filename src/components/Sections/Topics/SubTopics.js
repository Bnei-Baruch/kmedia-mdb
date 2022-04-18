import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors as tags } from '../../../redux/modules/tags';
import TagSourceItem from '../../FiltersAside/TopicsFilter/TagSourceItem';
import { Link } from 'react-router-dom';
import TagSourceItemModal from '../../FiltersAside/TopicsFilter/TagSourceItemModal';
import { withNamespaces } from 'react-i18next';
import { selectors as filters } from '../../../redux/modules/filters';
import FilterHeader from '../../FiltersAside/FilterHeader';

const MAX_SHOWED_ITEMS  = 10;
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

const SubTopics = ({ namespace, rootID, t }) => {
  const [open, setOpen]             = useState(false);
  const [isSelected, setIsSelected] = useState();

  const getTagById  = useSelector(state => tags.getTagById(state.tags));
  const getPathTags = useSelector(state => tags.getPathByID(state.tags));
  const baseItems   = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_TOPICS_MULTI));
  const selected    = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_TOPICS_MULTI))?.values || [];

  const root  = getTagById(rootID);
  const items = getItemsRecursive(rootID, getTagById, baseItems) || [];

  useEffect(() => {
    const sel = selected.includes(rootID);
    setIsSelected(sel);
  }, [selected, rootID]);

  const toggleOpen = () => setOpen(!open);

  if (!root?.children) return null;

  const children = root.children.filter(r => items.includes(r));
  return (

    <FilterHeader filterName={FN_TOPICS_MULTI}>
      {
        children.slice(0, MAX_SHOWED_ITEMS)
          .filter(r => items.includes(r))
          .map(r => <TagSourceItem
            id={r}
            namespace={namespace}
            baseItems={items}
            filterName={FN_TOPICS_MULTI}
            deep={0}
          />
          )
      }
      {
        children.length > MAX_SHOWED_ITEMS && (
          <>
            <Link onClick={toggleOpen}>{t('filters.aside-filter.show-languages-more')}</Link>
            <TagSourceItemModal
              parent={root}
              open={open}
              getById={getTagById}
              getPath={getPathTags}
              defaultSel={isSelected}
              onClose={toggleOpen}
              baseItems={baseItems}
              filterName={FN_TOPICS_MULTI}
              namespace={namespace}
            />
          </>
        )
      }
    </FilterHeader>
  );
};

export default withNamespaces()(SubTopics);
