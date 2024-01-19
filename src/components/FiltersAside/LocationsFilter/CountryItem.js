import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../helpers/consts';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { actions } from '../../../redux/modules/filters';
import CitiesModal from './CitiesModal';
import { filtersAsideCitiesByCountrySelector, filtersAsideGetStatsSelector, filtersGetFilterByNameSelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const CountryItem = ({ namespace, loc }) => {

  const { id, desc } = loc;

  const [open, setOpen] = useState(false);

  const selectedFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const cities          = useSelector(state => filtersAsideCitiesByCountrySelector(state, namespace))(id);
  const getStat         = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_LOCATIONS));
  const stat            = getStat(id);

  const uiDir    = useSelector(settingsGetUIDirSelector);
  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id && !cities.includes(x));
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LOCATIONS, val));
  };

  const toggleOpen = () => setOpen(!open);

  return (
    <>
      <List.Item key={id} disabled={stat === 0}>
        <List.Content className="tree_item_content">
          <Checkbox
            checked={selected.includes(id)}
            onChange={handleSelect}
            disabled={stat === 0}
            indeterminate={!selected.includes(id) && selected.some(x => cities.includes(x))}
          />
          <span className="tree_item_title">
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
      <CitiesModal namespace={namespace} open={open} country={id} onClose={() => setOpen(false)}/>
    </>
  );
};

export default CountryItem;
