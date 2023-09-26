import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../../src/helpers/consts';
import { isLanguageRtl } from '../../../../src/helpers/i18n-utils';

import { filterSlice, selectors as filters } from '../../../redux/slices/filterSlice/filterSlice';
import { selectors as filtersAside } from '../../../redux/slices/filterSlice/filterStatsSlice';
import { selectors as settings } from '../../../redux/slices/settingsSlice/settingsSlice';
import CitiesModal from './CitiesModal';

const CountryItem = ({ namespace, loc }) => {

  const { id, desc } = loc;

  const [open, setOpen] = useState(false);

  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters || [], [selectedFilters]);
  const cities          = useSelector(state => filtersAside.citiesByCountry(state.filterStats, namespace)(id));
  const getStat         = useSelector(state => filtersAside.getStats(state.filterStats, namespace, FN_LOCATIONS));
  const stat            = getStat(id);

  const uiDir    = useSelector(state => settings.getUIDir(state.settings));
  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const values = [...selected].filter(x => x !== id && !cities.includes(x));
    if (checked) {
      values.push(id);
    }

    dispatch(filterSlice.actions.setFilterValues({ namespace, name: FN_LOCATIONS, values }));
  };

  const toggleOpen = () => setOpen(!open);

  return (<>
      <List.Item key={id} disabled={stat === 0}>
        <List.Content className="tree_item_content">
          <Checkbox
            checked={selected.includes(id)}
            onChange={handleSelect}
            disabled={stat === 0}
            indeterminate={!selected.includes(id) && selected.some(x => cities.includes(x))}
          />
          <span
            className="tree_item_title">
          {desc}
        </span>
          <Button
            basic
            color="blue"
            className="clear_button no-shadow"
            icon={`caret ${uiDir === 'rtl' ? 'left' : 'right'}`}
            onClick={toggleOpen}
            size="medium"
            disabled={stat === 0}
          />
          <span className="stat">{`(${stat})`}</span>
        </List.Content>
      </List.Item>
      <CitiesModal namespace={namespace} open={open} county={id} onClose={() => setOpen(false)} />
    </>
  );
};

export default CountryItem;
