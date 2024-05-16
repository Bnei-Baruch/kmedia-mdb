import clsx from 'clsx';
import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Icon, Input, Modal, Table } from 'semantic-ui-react';

import CollectionItem from '../CollectionFilter/CollectionItem';
import {
  settingsGetUIDirSelector,
  mdbNestedGetCollectionByIdSelector,
  mdbGetCollectionsByCt
} from '../../../redux/selectors';
import { useTranslation } from 'react-i18next';
import { actions } from '../../../redux/modules/filtersAside';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CollectionsByCtModal = ({ namespace, onClose, ct }) => {
  const [query, setQuery] = useState('');
  const { t }             = useTranslation();

  const uiDir   = useSelector(settingsGetUIDirSelector);
  const getById = useSelector(mdbNestedGetCollectionByIdSelector);
  const ids     = useSelector(state => mdbGetCollectionsByCt(state, ct));

  const collections = useMemo(() => {
    const reg = new RegExp(query, 'i');
    return ids
      .map(getById)
      .filter(x => !!x)
      .filter(x => !query || (x.name && reg.test(x.name)))
      .sort((a, b) => a.name === b.name ? 0 : a.name > b.name ? 1 : -1);
  }, [ids, getById, query]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.collectionsByCt({ namespace, content_type: ct }));
  }, [dispatch, namespace]);

  const handleSetQuery = (e, data) => setQuery(data.value);

  const handleClose = () => {
    setQuery(null);
    onClose();
  };

  const renderRow = (x, i) => (
    <Table.Row key={i} verticalAlign="top">
      {collections.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </Table.Row>
  );

  const renderItem = (item, i) => {
    if (!item) return <Table.Cell key={i}/>;

    return (
      <Table.Cell className="tree_item_modal_content" key={item.id}>
        <CollectionItem namespace={namespace} item={item}/>
      </Table.Cell>
    );
  };

  const rows = buildRowArr(collections.length);

  return (
    <Modal
      open={true}
      dir={uiDir}
      onClose={handleClose}
      className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
      closeIcon={<Icon name="times circle outline"/>}
      size="fullscreen"
    >
      <Modal.Header className="no-border nowrap">
        {t(`filters.content-types.${ct}`)}
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
        <Button primary content={t('buttons.close')} onClick={handleClose}/>
      </Modal.Actions>
    </Modal>
  );
};

export default CollectionsByCtModal;
