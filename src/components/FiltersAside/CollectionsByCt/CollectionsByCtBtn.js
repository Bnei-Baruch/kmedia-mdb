import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/filters';
import {
  filtersAsideGetStatsSelector,
  filtersGetFilterByNameSelector,
  settingsGetLeftRightByDirSelector,
} from '../../../redux/selectors';
import CollectionsByCtModal from './CollectionsByCtModal';

const CollectionsByCtBtn = ({ namespace, ct }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const leftRight = useSelector(settingsGetLeftRightByDirSelector);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedCollections =
    useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_COLLECTION_MULTI))?.values || [];
  const selectedCT =
    useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];

  const stat = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(ct);

  const dispatch = useDispatch();
  const checkboxRef = useRef(null);

  const handleSelect = e => {
    const { checked } = e.target;
    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, []));

    checked
      ? dispatch(actions.setFilterValue(namespace, FN_CONTENT_TYPE, ct))
      : dispatch(actions.resetFilter(namespace, FN_CONTENT_TYPE));
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const isSelected = selectedCT.includes(ct);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = !isEmpty(selectedCollections) && !isSelected;
    }
  }, [selectedCollections, isSelected]);

  const arrowIcon = leftRight === 'right' ? 'arrow_right' : 'arrow_left';
  return (
    <div className={`tree_item_content ${stat === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="tree_item_content filters-aside-ct flex items-center justify-between no-wrap gap-2">
        <label className="flex items-center gap-2">
          <input ref={checkboxRef} type="checkbox" checked={isSelected} onChange={handleSelect} disabled={stat === 0} />
          {t(`filters.content-types.${ct}`)}
        </label>
        <span className="material-symbols-outlined text-blue-600 cursor-pointer text-2xl" onClick={() => setOpen(true)}>
          {arrowIcon}
        </span>
        <span className="stat">{`(${stat})`}</span>
      </div>
      {open && <CollectionsByCtModal onClose={handleClose} namespace={namespace} ct={ct} />}
    </div>
  );
};

export default CollectionsByCtBtn;
