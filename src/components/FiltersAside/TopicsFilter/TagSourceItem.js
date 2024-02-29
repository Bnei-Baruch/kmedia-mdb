import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/filters';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import TagSourceItemModal from './TagSourceItemModal';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector, filtersAsideGetMultipleStatsSelector, sourcesGetPathByIDSelector, tagsGetPathByIDSelector, sourcesGetSourceByIdSelector, tagsGetTagByIdSelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const TagSourceItem = props => {
  const { namespace, id, baseItems, filterName, deep, defaultSel = false } = props;

  const [open, setOpen] = useState(false);

  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, filterName));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const stat           = useSelector(state => filtersAsideGetStatsSelector(state, namespace, filterName))(id);
  const getSourceById  = useSelector(sourcesGetSourceByIdSelector);
  const getPathSources = useSelector(sourcesGetPathByIDSelector);
  const getTagById     = useSelector(tagsGetTagByIdSelector);
  const getPathTags    = useSelector(tagsGetPathByIDSelector);
  const uiDir          = useSelector(settingsGetUIDirSelector);

  const isTag = filterName === FN_TOPICS_MULTI;

  const getById = isTag ? getTagById : getSourceById;
  const getPath = isTag ? getPathTags : getPathSources;

  const pathIds = getPath(id)?.map(x => x.id);

  const item          = getById(id) || false;
  const childrenIDs   = useMemo(() => item.children?.filter(x => baseItems.includes(x)) || [], [baseItems, item]);
  const childrenStats = useSelector(state => filtersAsideGetMultipleStatsSelector(state, namespace, filterName, childrenIDs));
  const finalStat     = stat || childrenStats.reduce((sum, s) => sum + s, 0);
  const isSelected    = selected.includes(id) || defaultSel;

  const pathIDs     = selected.length > 0 ? selected.map(id => getPath(id)).flat().map(x => x.id) : [];
  const isOnSelPath = !selected.includes(id) && pathIDs.includes(id);

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    let val = [...selected].filter(x => x !== id);
    if (checked) {
      val = val.filter(x => !childrenIDs.includes(x));
      val.push(id);
    } else {
      //find more top selected parent item
      const pId = pathIds.find(x => val.includes(x));
      if (!!pId) {
        val = val.filter(x => !pathIds.includes(x));
        val = [...val, ...getById(pId).children.filter(x => !pathIds.includes(x))];
      }
    }

    dispatch(actions.setFilterValueMulti(namespace, filterName, val));
  };

  const toggleOpen = () => setOpen(!open);

  const renderSubList = () => (
    <List>
      {
        childrenIDs.filter(r => baseItems.includes(r))
          .map(x => (<TagSourceItem {...props} id={x} deep={deep - 1} defaultSel={isSelected} key={x}/>)
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
