import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_LANGUAGES } from '../../../helpers/consts';

const LanguageItem = ({ namespace, id }) => {

  const selected = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LANGUAGES))?.values || [];
  const stat     = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_LANGUAGES, id));

  const disabled = !stat || (selected.length > 0 && !selected.includes(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = checked ? id : null;
    dispatch(actions.setFilterValue(namespace, FN_LANGUAGES, val));
  };

  return (
    <List.Item key={`${FN_LANGUAGES}_${id}`} disabled={disabled}>
      <List.Content floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={id}
        checked={selected.includes(id)}
        disabled={disabled}
        onChange={handleSelect}
      />
    </List.Item>
  );
};

export default LanguageItem;
