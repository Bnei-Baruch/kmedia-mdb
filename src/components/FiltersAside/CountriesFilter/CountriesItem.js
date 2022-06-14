import { useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';
import { FN_COUNTRIES } from '../../../helpers/consts';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';

const CountriesItem = ({ namespace, id, t }) => {
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COUNTRIES));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const stat            = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_COUNTRIES)(id));

  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_COUNTRIES, val));
  };

  const title = t(`locations.${id.trim().toLowerCase().replace(/[\s_.]+/g, '-')}`, { defaultValue: id });
  return (
    <List.Item disabled={stat === 0}>
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={title}
        checked={selected.includes(id)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withNamespaces()(CountriesItem);
