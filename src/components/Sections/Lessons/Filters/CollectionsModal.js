import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Icon, Input, List, Modal, Table } from 'semantic-ui-react';

import { CT_VIRTUAL_LESSON, CT_VIRTUAL_LESSONS, FN_COLLECTION_MULTI, FN_CONTENT_TYPE } from '../../../../helpers/consts';
import { isEmpty } from '../../../../helpers/utils';
import { actions } from '../../../../redux/modules/filters';
import CollectionItem from '../../../FiltersAside/CollectionFilter/CollectionItem';
import {
  filtersAsideGetStatsSelector,
  filtersAsideGetTreeSelector,
  filtersGetFilterByNameSelector,
  settingsGetUIDirSelector,
  mdbNestedGetCollectionByIdSelector,
  settingsGetLeftRightByDirSelector
} from '../../../../redux/selectors';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CollectionsModal = ({ ct, namespace, t }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');

  const uiDir             = useSelector(settingsGetUIDirSelector);
  const leftRight         = useSelector(settingsGetLeftRightByDirSelector);
  const ids               = useSelector(state => filtersAsideGetTreeSelector(state, namespace, FN_COLLECTION_MULTI));
  const getById           = useSelector(mdbNestedGetCollectionByIdSelector);
  const stat              = useSelector(state => filtersAsideGetStatsSelector(state, namespace, FN_CONTENT_TYPE))(ct);
  const selectedFilters   = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_COLLECTION_MULTI));
  const selected          = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const selectedCTFilters = useSelector(state => filtersGetFilterByNameSelector(state, namespace, FN_CONTENT_TYPE));
  const selectedCT        = useMemo(() => selectedCTFilters?.values || [], [selectedCTFilters]);

  const itemsMemo = useMemo(() => ids.map(getById).filter(x => !!x), [ids, getById]);
  const items     = (itemsMemo.sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1))
    .filter(x => x.content_type === CT_VIRTUAL_LESSONS);

  const reg         = new RegExp(query, 'i');
  const collections = items.filter(x => !query || (x.name && reg.test(x.name)));

  const handleSetQuery = (e, data) => setQuery(data.value);

  const toggleOpen = () => setOpen(!open);

  const dispatch     = useDispatch();
  const handleSelect = (e, { checked }) => {
    const val = [...selectedCT].filter(x => x !== ct);
    if (checked) {
      val.push(ct);
    }

    dispatch(actions.setFilterValueMulti(namespace, FN_COLLECTION_MULTI, null));
    dispatch(actions.setFilterValueMulti(namespace, FN_CONTENT_TYPE, val));
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

  return (
    <>
      <List.Item key={`${FN_COLLECTION_MULTI}_${ct}`} disabled={stat === 0} className="filters-aside-ct">
        <List.Content className="stat" floated="right">
          {`(${stat})`}
        </List.Content>
        <Checkbox
          label={t(`filters.content-types.${ct}`)}
          checked={selectedCT.includes(ct)}
          onChange={handleSelect}
          indeterminate={!selectedCT.includes(ct) && !isEmpty(selected)}
          disabled={stat === 0}
        />
        <Button
          basic
          color="blue"
          className="clear_button no-shadow"
          icon={`caret ${leftRight}`}
          onClick={toggleOpen}
          size="medium"
          disabled={stat === 0}
        />
      </List.Item>
      <Modal
        open={open}
        dir={uiDir}
        onClose={toggleOpen}
        className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
        closeIcon={<Icon name="times circle outline" />}
        size="fullscreen"
      >
        <Modal.Header className="no-border nowrap">
          {t(`filters.content-types.${CT_VIRTUAL_LESSON}`)}
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
          <Button primary content={t('buttons.close')} onClick={toggleOpen} />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default withTranslation()(CollectionsModal);