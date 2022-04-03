import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tags } from '../../../redux/modules/tags';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import React, { useEffect, useState } from 'react';
import TagSourceItemModal from './TagSourceItemModal';
import { selectors as settings } from '../../../redux/modules/settings';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import clsx from 'clsx';

const TagSourceItem = ({ namespace, id, baseItems, filterName, deep }) => {
  const [open, setOpen] = useState(false);

  const selected       = useSelector(state => filters.getFilterByName(state.filters, namespace, filterName))?.values || [];
  const stat           = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, filterName, id));
  const getSourceById  = useSelector(state => sources.getSourceById(state.sources));
  const getPathSources = useSelector(state => sources.getPathByID(state.sources));
  const getTagById     = useSelector(state => tags.getTagById(state.tags));
  const getPathTags    = useSelector(state => tags.getPathByID(state.tags));
  const language       = useSelector(state => settings.getLanguage(state.settings));

  const isTag   = filterName === FN_TOPICS_MULTI;
  const getPath = isTag ? getPathTags : getPathSources;
  const getById = isTag ? getTagById : getSourceById;
  const item    = getById(id);

  const pathIDs     = selected.length > 0 ? getPath(selected?.[0]).map(x => x.id) : [];
  const isOnSelPath = pathIDs.includes(id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOnSelPath && !selected.includes(id))
      setOpen(true);
  }, [isOnSelPath]);

  const handleSelect = (e, { checked }) => {
    let val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, filterName, val));
  };

  const toggleOpen = () => setOpen(!open);

  const renderSubList = () => (
    <List>
      {
        item.children?.filter(r => baseItems.includes(r))
          .map(x => (
              <TagSourceItem
                namespace={namespace}
                id={x}
                baseItems={baseItems}
                filterName={filterName}
                deep={deep - 1}
              />
            )
          )
      }

    </List>
  );

  return (
    <List.Item key={`${filterName}_${id}`}>
      <List.Content className="tree_item_content">
        <Checkbox
          checked={selected.includes(id)}
          onChange={handleSelect}
        />
        <span
          className={clsx('margin-right-8', 'margin-left-8', { 'bold-font': item.children?.length > 0 })}>
          {item[isTag ? 'label' : 'name']}
        </span>
        {
          (deep === 0) && (item.children?.length > 0) && (
            <Button
              basic
              color="blue"
              className="clear_button no-shadow"
              icon={`caret ${open ? 'down' : isLanguageRtl(language) ? 'left' : 'right'}`}
              onClick={toggleOpen}
              size="medium"
            />
          )
        }
        <span className="stat">{`(${stat})`}</span>
      </List.Content>
      {
        (deep !== 0) && (item.children.length > 0) ? renderSubList() :
          <TagSourceItemModal
            filterName={filterName}
            baseItems={baseItems}
            namespace={namespace}
            parent={item}
            open={open}
            getById={getById}
            getPath={getPath}
            onClose={() => setOpen(false)}
          />
      }
    </List.Item>
  );
};

export default TagSourceItem;
