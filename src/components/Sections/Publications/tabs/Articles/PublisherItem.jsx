import { useDispatch, useSelector } from 'react-redux';

import { FN_PUBLISHER } from '../../../../../helpers/consts';
import { actions } from '../../../../../redux/modules/filters';
import { filtersGetFilterByNameSelector } from '../../../../../redux/selectors';

const PublisherItem = ({ namespace, item: { id, name } }) => {
  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_PUBLISHER))?.values || [];

  const dispatch = useDispatch();

  const handleSelect = e => {
    const val = [...selected].filter(x => x !== id);
    if (e.target.checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_PUBLISHER, val));
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
          {name}
        </label>
      </div>
    </div>
  );
};

export default PublisherItem;
