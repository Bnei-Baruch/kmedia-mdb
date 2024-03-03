import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';

import { actions } from '../../../redux/modules/filters';
import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import { withTranslation } from 'react-i18next';
import FilterHeader from '../../FiltersAside/FilterHeader';
import CollectionsModal, { cCtByUnitCt } from './CollectionsModal';
import {
  filtersAsideGetStatsSelector,
  filtersAsideGetTreeSelector,
  filtersGetFilterByNameSelector,
  mdbNestedGetCollectionByIdSelector,
  settingsGetLeftRightByDirSelector
} from '../../../redux/selectors';

const ContentTypesFilter = ({ namespace, t }) => {

  const [selectedCT, setSelectedCT] = useState('');

  const leftRight           = useSelector(settingsGetLeftRightByDirSelector);
  const ids                 = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_COLLECTION_MULTI));
  const getById             = useSelector(mdbNestedGetCollectionByIdSelector);
  const selectedCollections = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_COLLECTION_MULTI));
  const indeterminateCT     = useMemo(() => cCtByUnitCt[getById(selectedCollections?.values[0])?.content_type], [selectedCollections, getById]);

  const itemsMemo = useMemo(() => ids.map(getById).filter(x => !!x), [ids, getById]);
  const items     = (itemsMemo.sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1)).filter(x => cCtByUnitCt[selectedCT] === x.content_type);

  const selected = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];
  const getStat  = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE));

  const dispatch = useDispatch();

  const handleSelect = (e, { value, checked }) => {
    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, []));

    checked ? dispatch(actions.setFilterValue(namespace, FN_CONTENT_TYPE, value)) :
      dispatch(actions.resetFilter(namespace, FN_CONTENT_TYPE));
  };

  const renderItem = id => {
    const stat = getStat(id);

    return (<List.Item key={id} disabled={stat === 0} className="tree_item_content">
      <div className="tree_item_content">
        <Checkbox
          label={t(`filters.content-types.${id}`)}
          checked={selected.includes(id)}
          onChange={handleSelect}
          disabled={stat === 0 || (selected.length > 0 && !selected.includes(id))}
          value={id}
          indeterminate={indeterminateCT === id}
        />
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${leftRight}`}
          onClick={() => setSelectedCT(id)}
          size="medium"
        />
        <span>{`(${stat})`}</span>
      </div>
    </List.Item>);
  };

  return (<>
    <CollectionsModal
      namespace={namespace}
      items={items}
      selectedCT={selectedCT}
      onClose={() => setSelectedCT('')}
    />
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={UNIT_PROGRAMS_TYPE.map(renderItem)}
    />
  </>);
};

export default withTranslation()(ContentTypesFilter);
