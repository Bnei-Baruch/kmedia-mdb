import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as sources } from '../../../redux/modules/sources';
import { selectors as tags } from '../../../redux/modules/tags';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import React, { useEffect, useMemo, useState } from 'react';
import TagSourceItemModal from './TagSourceItemModal';
import { selectors as settings } from '../../../redux/modules/settings';
import { isLanguageRtl } from '../../../helpers/i18n-utils';
import clsx from 'clsx';

const TagSourceItem = props => {
  const { namespace, id, baseItems, filterName, deep, defaultSel = false } = props;

  const [open, setOpen]               = useState(false);
  const [isOnSelPath, setIsOnSelPath] = useState(false);
  const [isSelected, setIsSelected]   = useState(defaultSel);

  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, filterName));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const stat           = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, filterName)(id));
  const getSourceById  = useSelector(state => sources.getSourceById(state.sources));
  const getPathSources = useSelector(state => sources.getPathByID(state.sources));
  const getTagById     = useSelector(state => tags.getTagById(state.tags));
  const getPathTags    = useSelector(state => tags.getPathByID(state.tags));
  const language       = useSelector(state => settings.getLanguage(state.settings));

  const isTag       = filterName === FN_TOPICS_MULTI;
  const getPath     = isTag ? getPathTags : getPathSources;
  const pathIds     = getPath(id)?.map(x => x.id);
  const getById     = isTag ? getTagById : getSourceById;
  const item        = getById(id);
  const childrenIDs = useMemo(() => item.children?.filter(x => baseItems.includes(x)) || [], [baseItems, item]);
  const childrenStats = useSelector(state => filtersAside.getMultipleStats(state.filtersAside, namespace, filterName)(childrenIDs));
  const finalStat = stat || childrenStats.reduce((sum, s) => sum + s, 0);

  useEffect(() => {
    const sel = selected.includes(id) || defaultSel;
    setIsSelected(sel);
  }, [selected, id, defaultSel]);

  useEffect(() => {
    const pathIDs = selected.length > 0 ? selected.map(id => getPath(id)).flat().map(x => x.id) : [];
    setIsOnSelPath(!selected.includes(id) && pathIDs.includes(id));
  }, [selected, id, getPath]);

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
              icon={`caret ${isLanguageRtl(language) ? 'left' : 'right'}`}
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
