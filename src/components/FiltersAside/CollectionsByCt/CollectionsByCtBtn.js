import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, List } from 'semantic-ui-react';
import { FN_COLLECTION_MULTI, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { actions } from '../../../redux/modules/filters';
import {
  filtersAsideGetStatsSelector,
  filtersGetFilterByNameSelector,
  settingsGetLeftRightByDirSelector
} from '../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import CollectionsByCtModal from './CollectionsByCtModal';

const CollectionsByCtBtn = ({ namespace, ct }) => {
  const [open, setOpen] = useState(false);
  const { t }           = useTranslation();

  const leftRight           = useSelector(settingsGetLeftRightByDirSelector);
  const selectedCollections = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_COLLECTION_MULTI))?.values || [];
  const selectedCT          = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE))?.values || [];

  const stat = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(ct);

  const dispatch = useDispatch();

  const handleSelect = (e, { value, checked }) => {
    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, []));

    checked ? dispatch(actions.setFilterValue(namespace, FN_CONTENT_TYPE, value)) :
      dispatch(actions.resetFilter(namespace, FN_CONTENT_TYPE));
  };

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const isSelected = selectedCT.includes(ct);
  return (
    <List.Item disabled={stat === 0} className="tree_item_content">
      <List.Content className="tree_item_content filters-aside-ct">
        <Checkbox
          label={t(`filters.content-types.${ct}`)}
          checked={isSelected}
          onChange={handleSelect}
          disabled={stat === 0}
          value={ct}
          indeterminate={!isEmpty(selectedCollections) && !isSelected}
        />
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${leftRight}`}
          onClick={() => setOpen(true)}
          size="medium"
        />
        <span className="stat">{`(${stat})`}</span>
      </List.Content>
      {open && <CollectionsByCtModal onClose={handleClose} namespace={namespace} ct={ct}/>}
    </List.Item>
  );
};

export default CollectionsByCtBtn;
