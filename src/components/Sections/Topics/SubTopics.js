import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/filtersAside';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors as tags } from '../../../redux/modules/tags';
import TagSourceItem from '../../FiltersAside/TopicsFilter/TagSourceItem';
import TagSourceItemModal from '../../FiltersAside/TopicsFilter/TagSourceItemModal';
import { withNamespaces } from 'react-i18next';
import { selectors as filters } from '../../../redux/modules/filters';
import FilterHeader from '../../FiltersAside/FilterHeader';
import { Button, Input } from 'semantic-ui-react';
import RenderAsList from '../../FiltersAside/TopicsFilter/RenderAsList';

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

const SubTopics = ({ namespace, rootID, t }) => {
  const [open, setOpen]             = useState(false);
  const [isSelected, setIsSelected] = useState();
  const [query, setQuery]           = useState();

  const getTagById  = useSelector(state => tags.getTagById(state.tags));
  const getPathTags = useSelector(state => tags.getPathByID(state.tags));
  const baseItems   = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_TOPICS_MULTI));
  const selected    = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_TOPICS_MULTI))?.values || [];

  const root  = getTagById(rootID);
  const items = useMemo(() => getItemsRecursive(rootID, getTagById, baseItems) || [], [rootID, getTagById, baseItems]);

  useEffect(() => {
    const sel = selected.includes(rootID);
    setIsSelected(sel);
  }, [selected, rootID]);

  const toggleOpen = () => setOpen(!open);

  const handleSetQuery = (e, data) => setQuery(data.value);

  const children = root.children?.filter(r => items.includes(r));

  if (!(children?.length > 0))
    return null;

  const renderAsTree = () => (
    <>
      {
        children.slice(0, MAX_SHOWED_ITEMS)
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
        placeholder={t('filters.aside-filter.search-input-topic')}
        onChange={handleSetQuery}
        value={query}
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

export default withNamespaces()(SubTopics);