import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FN_CONTENT_TYPE } from '../../../helpers/consts';
import ContentTypeItem from './ContentTypeItem';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersAsideGetTreeSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const ContentTypeItemGroup = ({ namespace, group }) => {
  const { t } = useTranslation();
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
    <div className={stats === 0 ? 'opacity-50 pointer-events-none' : ''}>
      <div className="filters-aside-ct">
        <div className="filters-aside-ct__group">
          <label className="filters-aside-ct__label cursor-pointer">
            <input
              ref={checkboxRef}
              type="checkbox"
              checked={isSelAll}
              onChange={handleSelect}
              disabled={stats === 0}
            />
            <span className="font-bold">{t(`nav.sidebar.${key}`)}</span>
          </label>
        </div>
        <span className="stat">{`(${stats})`}</span>
      </div>
      <div className="pl-4">
        {items.map(id => <ContentTypeItem namespace={namespace} id={id} key={id}/>)}
      </div>
    </div>
  );
};

export default ContentTypeItemGroup;
