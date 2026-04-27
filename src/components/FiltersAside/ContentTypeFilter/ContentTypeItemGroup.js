import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersAsideGetTreeSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const ContentTypeItemGroup = ({ namespace, group, t }) => {
  const { cts, key } = group;

  const selectedItems = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_CONTENT_TYPE));
  const items         = selectedItems.filter(ct => cts.includes(ct));

  let selected    = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  selected        = selected.filter(ct => cts.includes(ct));
  const statsById = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE));
  const stats     = cts.reduce((acc, x) => acc + statsById(x), 0);

  const dispatch    = useDispatch();
  const checkboxRef = useRef(null);

  const isSelAll = items.length > 0
    ? cts.filter(ct => items.includes(ct)).length === selected.length
    : false;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = selected.length > 0 && !isSelAll;
    }
  }, [selected.length, isSelAll]);

  if (!(items?.length > 0))
    return null;

  const handleSelect = e => {
    const val = [...selected].filter(x => !cts.includes(x));
    if (e.target.checked) {
      val.push(...cts.filter(ct => items.includes(ct)));
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
  };

  return (
    <>
      {
        items.length > 0 && (
          <li key={key} className="filters-aside-ct">
            <div className="bold-font">
              <label className="flex items-center gap-2">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isSelAll}
                  onChange={handleSelect}
                  disabled={stats === 0}
                />
                {t(`nav.sidebar.${key}`)}
              </label>
            </div>
            <ul>
              {items.map(id => <ContentTypeItem namespace={namespace} id={id} key={id}/>)}
            </ul>
          </li>
        )
      }
    </>
  );
};

export default withTranslation()(ContentTypeItemGroup);
