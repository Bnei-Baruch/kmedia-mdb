import React, { useEffect, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, List } from 'semantic-ui-react';

import { FN_PERSON_FILTER, RABASH_PERSON_UID } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { actions as assets } from '../../../redux/modules/assets';
import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside } from '../../../redux/modules/filtersAside';

const PersonFilter = ({ namespace, t }) => {
  const stat            = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_PERSON_FILTER)(RABASH_PERSON_UID));
  const selectedFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_PERSON_FILTER));
  const selected        = useMemo(() => selectedFilters?.values || [], [selectedFilters]);

  const dispatch = useDispatch();
  useEffect(() => {
    assets.fetchPerson();
  }, []);
  const handleSelect = (e, { checked }) => {
    const val = selected.filter(x => x !== RABASH_PERSON_UID);
    if (checked) {
      val.push(RABASH_PERSON_UID);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_PERSON_FILTER, val));
  };

  return (
    <List.Item key={`${RABASH_PERSON_UID}`} disabled={stat === 0} className="filters-aside-ct">
      <List.Content className="stat" floated="right">
        {`(${stat})`}
      </List.Content>
      <Checkbox
        label={t(`filters.content-types.${RABASH_PERSON_UID}`)}
        checked={!isEmpty(selected)}
        onChange={handleSelect}
        disabled={stat === 0}
      />
    </List.Item>
  );
};

export default withNamespaces()(PersonFilter);
