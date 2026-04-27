import { useDispatch, useSelector } from 'react-redux';

import { FN_LANGUAGES, LANGUAGES } from '../../../helpers/consts';
import { actions } from '../../../redux/modules/filters';
import { filtersAsideGetStatsSelector, filtersGetFilterByNameSelector } from '../../../redux/selectors';

const LanguageItem = ({ namespace, id }) => {
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_LANGUAGES))?.values || [];
  const stat     = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_LANGUAGES))(id);

  const dispatch = useDispatch();

  const handleSelect = e => {
    const val = [...selected].filter(x => x !== id);
    if (e.target.checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LANGUAGES, val));
  };

  return (
    <div className={stat === 0 ? 'opacity-50 pointer-events-none' : ''}>
      <span className="stat float-right">
        {`(${stat})`}
      </span>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selected.includes(id)}
          onChange={handleSelect}
          disabled={stat === 0}
        />
        {LANGUAGES[id]?.name}
      </label>
    </div>
  );
};

export default LanguageItem;
