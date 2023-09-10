import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { withTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Icon, Input, List, Modal, Table } from 'semantic-ui-react';
import { CT_HOLIDAY, FN_COLLECTION_MULTI, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { getLanguageDirection, isLanguageRtl } from '../../../helpers/i18n-utils';
import { isEmpty } from '../../../helpers/utils';
import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside, selectors } from '../../../redux/modules/filtersAside';
import { selectors as mdb } from '../../../../lib/redux/slices/mdbSlice/mdbSlice';

import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';
import CollectionItem from '../../FiltersAside/CollectionFilter/CollectionItem';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const Holidays = ({ namespace, t }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen]   = useState(false);

  const uiDir               = useSelector(state => settings.getUIDir(state.settings));
  const ids                 = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_COLLECTION_MULTI));
  const getById             = useSelector(state => mdb.nestedGetCollectionById(state.mdb));
  const selectedCollections = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COLLECTION_MULTI)?.values || []);
  const selectedCT          = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE)?.values || []);

  const stat = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE)(CT_HOLIDAY));

  const collections = useMemo(() => {
    const reg = new RegExp(query, 'i');
    return ids
      .map(getById)
      .filter(x => !!x)
      .filter(x => x.content_type === CT_HOLIDAY)
      .filter(x => !query || (x.name && reg.test(x.name)))
      .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1);
  }, [ids, getById, query]);

  const dispatch = useDispatch();

  const handleSelect = (e, { value, checked }) => {
    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, []));

    checked ? dispatch(actions.setFilterValue(namespace, FN_CONTENT_TYPE, value)) :
      dispatch(actions.resetFilter(namespace, FN_CONTENT_TYPE));
  };

  const handleSetQuery = (e, data) => setQuery(data.value);

  const handleClose = () => {
    setQuery(null);
    setOpen(false);
  };

  const renderRow = (x, i) => (
    <Table.Row key={i} verticalAlign="top">
      {collections.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </Table.Row>
  );

  const renderItem = (item, i) => {
    if (!item) return <Table.Cell key={i} />;

    return (
      <Table.Cell className="tree_item_modal_content" key={item.id}>
        <CollectionItem namespace={namespace} item={item} />
      </Table.Cell>
    );
  };

  const rows = buildRowArr(collections.length);

  const isSelected = selectedCT.includes(CT_HOLIDAY);
  return (
    <List.Item disabled={stat === 0} className="tree_item_content">
      <List.Content className="tree_item_content filters-aside-ct">
        <Checkbox
          label={t(`filters.content-types.${CT_HOLIDAY}`)}
          checked={isSelected}
          onChange={handleSelect}
          disabled={stat === 0}
          value={CT_HOLIDAY}
          indeterminate={!isEmpty(selectedCollections) && !isSelected}
        />
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${uiDir === 'rtl' ? 'left' : 'right'}`}
          onClick={() => setOpen(true)}
          size="medium"
        />
        <span className="stat">{`(${stat})`}</span>
      </List.Content>

      <Modal
        open={open}
        dir={uiDir}
        onClose={handleClose}
        className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
        closeIcon={<Icon name="times circle outline" />}
        size="fullscreen"
      >
        <Modal.Header className="no-border nowrap">
          {t(`filters.content-types.${CT_HOLIDAY}`)}
          <Input
            className="search-input"
            placeholder={t('sources-library.filter')}
            onChange={handleSetQuery}
            defaultValue={query}
          />
        </Modal.Header>
        <Modal.Content scrolling>
          <Table celled={false} basic>
            <Table.Body>
              {
                rows.map(renderRow)
              }
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button primary content={t('buttons.close')} onClick={handleClose} />
        </Modal.Actions>
      </Modal>
    </List.Item>
  );
};

export default withTranslation()(Holidays);
