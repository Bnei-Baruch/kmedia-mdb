import React, { useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';
import { FN_LOCATIONS } from '../../../helpers/consts';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { selectors as settings } from '../../../redux/modules/settings';
import { getTitle } from './helper';

const CountryItem = ({ namespace, id, t }) => {

  const [open, setOpen] = useState(false);

  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_LOCATIONS));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const getStat         = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_LOCATIONS));
  const stat            = getStat(id);
  if (id === 'Israel') {
    console.log('s', stat);
    console.log(getStat(id));
  }
  const language = useSelector(state => settings.getLanguage(state.settings));
  const dispatch = useDispatch();

  const handleSelect = (e, { checked }) => {
    const val = [...selected].filter(x => x !== id);
    if (checked) {
      val.push(id);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_LOCATIONS, val));
  };

  const title = getTitle(id, t);

  const toggleOpen = () => setOpen(!open);

  return (
    <List.Item key={title} disabled={stat === 0}>
      <List.Content className="tree_item_content">
        <Checkbox
          checked={selected?.countries?.includes(id)}
          onChange={handleSelect}
          disabled={stat === 0}
        />
        <span
          className="tree_item_title">
          {title}
        </span>
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${isLanguageRtl(language) ? 'left' : 'right'}`}
          onClick={toggleOpen}
          size="medium"
          disabled={stat === 0}
        />
        <span className="stat">{`(${stat})`}</span>
      </List.Content>
    </List.Item>
  );
};

export default withNamespaces()(CountryItem);