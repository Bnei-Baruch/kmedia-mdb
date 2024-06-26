import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import TagSourceItem from '../../FiltersAside/TopicsFilter/TagSourceItem';
import TagSourceItemModal from '../../FiltersAside/TopicsFilter/TagSourceItemModal';
import { useTranslation } from 'react-i18next';
import FilterHeader from '../../FiltersAside/FilterHeader';
import { Button, Input } from 'semantic-ui-react';
import RenderAsList from '../../FiltersAside/TopicsFilter/RenderAsList';
import {
  filtersAsideGetTreeSelector,
  filtersGetFilterByNameSelector,
  tagsGetPathByIDSelector,
  tagsGetRootsSelector,
  tagsGetTagByIdSelector
} from '../../../redux/selectors';

const MAX_SHOWED_ITEMS  = 10;
const getItemsRecursive = (rootID, getById, base) => {
  if (base?.length === 0) return [];

  const root = getById(rootID);
  if (!root.children || root.children.length === 0) {
    return base.includes(rootID) ? [rootID] : null;
  }

  const resp = root
    .children
    .map(x => getItemsRecursive(x, getById, base))
    .filter(x => !!x)
    .flat();
  if (resp.length > 0) resp.push(rootID);
  return resp;
};

const SubTopics = ({ namespace, rootID }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState();

  const { t }           = useTranslation();
  const getTagById      = useSelector(tagsGetTagByIdSelector);
  const getPathTags     = useSelector(tagsGetPathByIDSelector);
  const roots           = useSelector(tagsGetRootsSelector);
  const baseItems       = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_TOPICS_MULTI));
  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_TOPICS_MULTI));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const root  = getTagById(rootID);
  const items = useMemo(() => getItemsRecursive(rootID, getTagById, baseItems) || [], [rootID, getTagById, baseItems]);

  useEffect(() => setQuery(null), []);
  const isSelected = selected.includes(rootID);

  const toggleOpen = () => setOpen(!open);

  const handleSetQuery = (e, data) => setQuery(data.value);

  const children = rootID ? root.children?.filter(r => items.includes(r)) : roots;

  if (!(children?.length > 0))
    return null;

  const renderAsTree = () => (
    <>
      {
        children.slice(0, MAX_SHOWED_ITEMS)
          .map(r =>
            <TagSourceItem
              id={r}
              namespace={namespace}
              baseItems={items}
              filterName={FN_TOPICS_MULTI}
              deep={0}
              key={r}
            />
          )
      }
      {
        children.length > MAX_SHOWED_ITEMS && (
          <>
            <Button
              basic
              icon="plus"
              color="blue"
              className="clear_button"
              content={t('topics.show-more')}
              onClick={toggleOpen}
            />
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
    </>
  );

  return (
    <FilterHeader filterName={FN_TOPICS_MULTI}>
      <Input
        className="search-input"
        placeholder={t('sources-library.filter')}
        onChange={handleSetQuery}
        defaultValue={query}
      />
      {
        !query ? renderAsTree() : (
          <RenderAsList
            query={query}
            namespace={namespace}
            baseItems={items}
            filterName={FN_TOPICS_MULTI}
          />
        )
      }
    </FilterHeader>
  );
};

export default SubTopics;
