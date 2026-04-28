import { useDispatch, useSelector } from 'react-redux';

import { clsx } from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import {
  filtersAsideGetMultipleStatsSelector,
  filtersAsideGetStatsSelector,
  filtersGetFilterByNameSelector,
  settingsGetLeftRightByDirSelector,
  sourcesGetPathByIDSelector,
  sourcesGetSourceByIdSelector,
  tagsGetPathByIDSelector,
  tagsGetTagByIdSelector
} from '../../../redux/selectors';
import TagSourceItemModal from './TagSourceItemModal';

const TagSourceItem = props => {
  const { namespace, id, baseItems, filterName, deep, defaultSel = false } = props;

  const [open, setOpen] = useState(false);
  const checkboxRef = useRef(null);

  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, filterName));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const stat           = useSelector(state => filtersAsideGetStatsSelector(state, namespace, filterName))(id);
  const getSourceById  = useSelector(sourcesGetSourceByIdSelector);
  const getPathSources = useSelector(sourcesGetPathByIDSelector);
  const getTagById     = useSelector(tagsGetTagByIdSelector);
  const getPathTags    = useSelector(tagsGetPathByIDSelector);
  const leftRight      = useSelector(settingsGetLeftRightByDirSelector);

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

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isOnSelPath;
    }
  }, [isOnSelPath]);

  const dispatch = useDispatch();

  const handleSelect = e => {
    const { checked } = e.target;
    let val = [...selected].filter(x => x !== id);
    if (checked) {
      val = val.filter(x => !childrenIDs.includes(x));
      val.push(id);
    } else {
      const pId = pathIds.find(x => val.includes(x));
      if (pId) {
        val = val.filter(x => !pathIds.includes(x));
        val = [...val, ...getById(pId).children.filter(x => !pathIds.includes(x))];
      }
    }

    dispatch(actions.setFilterValueMulti(namespace, filterName, val));
  };

  const toggleOpen = () => setOpen(!open);

  const arrowIcon = leftRight === 'right' ? 'arrow_right' : 'arrow_left';

  const renderSubList = () => (
    <div className="pr-1.5 pl-1.5">
      {
        childrenIDs.filter(r => baseItems.includes(r))
          .map(x => (<TagSourceItem {...props} id={x} deep={deep - 1} defaultSel={isSelected} key={x} />)
          )
      }
    </div>
  );

  return (
    <div key={`${filterName}_${id}`} className={`pt-1/2 ${finalStat === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between no-wrap gap-2">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          disabled={finalStat === 0}
        />
        <span
          className={clsx('tree_item_title', { 'bold-font': deep === 1 })}>
          {item[isTag ? 'label' : 'name']}
        </span>
        {
          (deep === 0) && (childrenIDs.length > 0) && (
            <span className="material-symbols-outlined text-blue-600 cursor-pointer text-2xl" onClick={toggleOpen}>
              {arrowIcon}
            </span>
          )
        }
        <span className="stat">{`(${finalStat})`}</span>
      </div>
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
    </div>
  );
};

export default TagSourceItem;
