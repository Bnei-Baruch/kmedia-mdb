import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Icon, Input, List, Modal, Table } from 'semantic-ui-react';

import { CT_VIRTUAL_LESSON, CT_VIRTUAL_LESSONS, FN_COLLECTION_MULTI, FN_CONTENT_TYPE } from '../../../helpers/consts';
import { getLanguageDirection, isLanguageRtl } from '../../../helpers/i18n-utils';
import { isEmpty } from '../../../helpers/utils';
import { actions, selectors as filters } from '../../../redux/modules/filters';
import { selectors as filtersAside, selectors } from '../../../redux/modules/filtersAside';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import CollectionItem from '../../FiltersAside/CollectionFilter/CollectionItem';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CollectionsModal = ({ ct, namespace, t }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');

  const language          = useSelector(state => settings.getLanguage(state.settings));
  const ids               = useSelector(state => selectors.getTree(state.filtersAside, namespace, FN_COLLECTION_MULTI));
  const getById           = useSelector(state => mdb.nestedGetCollectionById(state.mdb));
  const stat              = useSelector(state => filtersAside.getStats(state.filtersAside, namespace, FN_CONTENT_TYPE)(ct));
  const selectedFilters   = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_COLLECTION_MULTI));
  const selected          = useMemo(() => selectedFilters?.values || [], [selectedFilters]);
  const selectedCTFilters = useSelector(state => filters.getFilterByName(state.filters, namespace, FN_CONTENT_TYPE));
  const selectedCT        = useMemo(() => selectedCTFilters?.values || [], [selectedCTFilters]);

  const itemsMemo = useMemo(() => ids.map(getById).filter(x => !!x), [ids]);
  const items     = (itemsMemo.sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1))
    .filter(x => x.content_type === CT_VIRTUAL_LESSONS);

  const dir = getLanguageDirection(language);

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
          icon={`caret ${isLanguageRtl(language) ? 'left' : 'right'}`}
          onClick={toggleOpen}
          size="medium"
          disabled={stat === 0}
        />
      </List.Item>
      <Modal
        open={open}
        dir={dir}
        onClose={toggleOpen}
        className={clsx('filters_aside_tree_modal', { [dir]: true })}
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
            {
              rows.map(renderRow)
            }
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button primary content={t('buttons.close')} onClick={toggleOpen} />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default withNamespaces()(CollectionsModal);
