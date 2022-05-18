import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Button, Icon, Input, Modal, Table } from 'semantic-ui-react';

import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import CollectionItem from './CollectionItem';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CollectionsModal = ({ namespace, open, onClose, items, t }) => {
  const [query, setQuery] = useState('');

  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  const reg         = new RegExp(query, 'i');
  const collections = items.filter(x => !query || (x.name && reg.test(x.name)));

  const handleSetQuery = (e, data) => setQuery(data.value);

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
    <Modal
      open={open}
      dir={dir}
      onClose={onClose}
      closeIcon={<Icon name="times circle outline" />}
      size="fullscreen"
    >
      <Modal.Header className="no-border nowrap">
        {t('sources-library.filter')}
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
        <Button primary content={t('buttons.close')} onClick={onClose} />
      </Modal.Actions>
    </Modal>
  );
};

export default withNamespaces()(CollectionsModal);
