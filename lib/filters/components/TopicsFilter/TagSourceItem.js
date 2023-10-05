import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { selectors as sources } from '../../../redux/slices/sourcesSlice/sourcesSlice';
import { selectors as tags } from '../../../redux/slices/tagsSlice/tagsSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { FN_TOPICS_MULTI } from '../../../../src/helpers/consts';
import { selectors as settings } from '../../../redux/slices/settingsSlice/settingsSlice';
import TagSourceItemModal from './TagSourceItemModal';
import { updateFiltersSearchParams } from '../../helper';
import { definitionsByName } from '../../transformer';

const TagSourceItem = props => {
  const { namespace, id, baseItems, filterName, deep, defaultSel = false } = props;

  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router       = useRouter();
  const selected     = searchParams.getAll(definitionsByName[filterName].queryKey);

  const stat           = useSelector(state => filtersAside.getStats(state.filterStats, namespace, filterName)(id));
  const getSourceById  = useSelector(state => sources.getSourceById(state.sources));
  const getPathSources = useSelector(state => sources.getPathByID(state.sources));
  const getTagById     = useSelector(state => tags.getTagById(state.tags));
  const getPathTags    = useSelector(state => tags.getPathByID(state.tags));
  const uiDir          = useSelector(state => settings.getUIDir(state.settings));

  const isTag = filterName === FN_TOPICS_MULTI;

  const getById = isTag ? getTagById : getSourceById;
  const getPath = isTag ? getPathTags : getPathSources;

  const pathIds = getPath(id)?.map(x => x.id);

  const item          = getById(id) || false;
  const childrenIDs   = useMemo(() => item.children?.filter(x => baseItems.includes(x)) || [], [baseItems, item]);
  const childrenStats = useSelector(state => filtersAside.getMultipleStats(state.filterStats, namespace, filterName)(childrenIDs));
  const finalStat     = stat || childrenStats.reduce((sum, s) => sum + s, 0);
  const isSelected    = selected.includes(id) || defaultSel;

  const pathIDs     = selected.length > 0 ? selected.map(id => getPath(id)).flat().map(x => x.id) : [];
  const isOnSelPath = !selected.includes(id) && pathIDs.includes(id);

  const handleSelect = (e, { checked }) => {
    let values = [...selected].filter(x => x !== id);
    if (checked) {
      values = values.filter(x => !childrenIDs.includes(x));
      values.push(id);
    } else {
      //find more top selected parent item
      const pId = pathIds.find(x => values.includes(x));
      if (!!pId) {
        values = values.filter(x => !pathIds.includes(x));
        values = [...values, ...getById(pId).children.filter(x => !pathIds.includes(x))];
      }
    }

    const query = updateFiltersSearchParams(id, checked, filterName, searchParams);
    router.push({ query }, undefined, { scroll: false });
  };

  const toggleOpen = () => setOpen(!open);

  const renderSubList = () => (
    <List>
      {
        childrenIDs.filter(r => baseItems.includes(r))
          .map(x => (<TagSourceItem {...props} id={x} deep={deep - 1} defaultSel={isSelected} key={x} />)
          )
      }

    </List>
  );

  return (
    <List.Item key={`${filterName}_${id}`} disabled={finalStat === 0}>
      <List.Content className="tree_item_content">
        <Checkbox
          checked={isSelected}
          onChange={handleSelect}
          indeterminate={isOnSelPath}
          disabled={finalStat === 0}
        />
        <span
          className={clsx('tree_item_title', { 'bold-font': deep === 1 })}>
          {item[isTag ? 'label' : 'name']}
        </span>
        {
          (deep === 0) && (childrenIDs.length > 0) && (
            <Button
              basic
              color="blue"
              className="clear_button no-shadow"
              icon={`caret ${uiDir === 'rtl' ? 'left' : 'right'}`}
              onClick={toggleOpen}
              size="medium"
              disabled={finalStat === 0}
            />
          )
        }
        <span className="stat">{`(${finalStat})`}</span>
      </List.Content>
      {
        (deep !== 0) && (childrenIDs.length > 0) ? renderSubList() :
          <TagSourceItemModal
            {...props}
            parent={item}
            open={open}
            getById={getById}
            getPath={getPath}
            defaultSel={isSelected}
            onClose={() => setOpen(false)}
          />
      }
    </List.Item>
  );
};

export default TagSourceItem;
