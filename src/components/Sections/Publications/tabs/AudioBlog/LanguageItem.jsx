import { useDispatch, useSelector } from 'react-redux';

import { FN_LANGUAGES, LANGUAGES } from '../../../../../helpers/consts';
import { actions } from '../../../../../redux/modules/filters';
import { filtersGetFilterByNameSelector } from '../../../../../redux/selectors';

const LanguageItem = ({ namespace, id }) => {
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_LANGUAGES))?.values || [];

  const dispatch = useDispatch();

  const handleSelect = e => {
    const val = [...selected].filter(x => x !== id);
    if (e.target.checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LANGUAGES, val));
  };

  return (
    <div className="filters-aside-ct font-normal">
      <div className="filters-aside-ct__group">
        <label className="filters-aside-ct__label cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(id)}
            onChange={handleSelect}
          />
          {LANGUAGES[id]?.name}
        </label>
      </div>
    </div>
  );
};

export default LanguageItem;
