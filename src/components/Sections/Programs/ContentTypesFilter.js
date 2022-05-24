import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, List, Radio } from 'semantic-ui-react';
import { isLanguageRtl } from '../../../helpers/i18n-utils';

import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors, selectors as filtersAside } from '../../../redux/modules/filtersAside';
import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE, UNIT_PROGRAMS_TYPE } from '../../../helpers/consts';
import { withNamespaces } from 'react-i18next';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import FilterHeader from '../../FiltersAside/FilterHeader';
import CollectionsModal, { cCtByUnitCt } from './CollectionsModal';

const ContentTypesFilter = ({ namespace, openModal, t }) => {

  const [showCByCT, setShowCByCT] = useState('');

  const language = useSelector(state => settings.getLanguage(state.settings));
  const ids      = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_COLLECTION_MULTI));
  const getById  = useSelector(state => mdb.nestedGetCollectionById(state.mdb));

  const itemsMemo = useMemo(() => ids.map(getById).filter(x => !!x), [ids]);
  const items     = itemsMemo.filter(x => cCtByUnitCt[showCByCT] === x.content_type);

  const selectedCT = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE))?.values || [];
  const getStat    = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE));

  const dispatch = useDispatch();

  const handleSelect = (e, { value }) =>
    dispatch(actions.setFilterValue(namespace, FN_CONTENT_TYPE, value));

  const renderItem = id => {
    const stat = getStat(id);

    return (<List.Item key={id} disabled={stat === 0} className="tree_item_content">
      <div className="tree_item_content">
        <Radio
          label={t(`filters.content-types.${id}`)}
          checked={selectedCT.includes(id)}
          onChange={handleSelect}
          value={id}
          disabled={stat === 0}
          name="programRadio"
        />
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${isLanguageRtl(language) ? 'left' : 'right'}`}
          onClick={() => setShowCByCT(id)}
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
      open={!!showCByCT}
      onClose={() => setShowCByCT('')}
    />
    <FilterHeader
      filterName={FN_CONTENT_TYPE}
      children={UNIT_PROGRAMS_TYPE.map(renderItem)}
    />
  </>);
};
export default withNamespaces()(ContentTypesFilter);
