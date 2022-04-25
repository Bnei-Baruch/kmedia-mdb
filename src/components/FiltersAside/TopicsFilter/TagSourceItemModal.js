import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Button, Icon, Input, Modal, Table } from 'semantic-ui-react';
import clsx from 'clsx';

import { FN_TOPICS_MULTI } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import TagSourceItem from './TagSourceItem';

const ITEMS_PER_ROW = 3;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const TagSourceItemModal = props => {
  const {
          baseItems,
          filterName,
          parent,
          open,
          onClose,
          getById,
          getPath,
          t
        } = props;

  const [query, setQuery] = useState('');

  const language = useSelector(state => settings.getLanguage(state.settings));

  if (!parent) return null;

  const handleSetQuery = (e, data) => setQuery(data.value);

  const dir   = getLanguageDirection(language);
  const isTag = filterName === FN_TOPICS_MULTI;
  const field = isTag ? 'label' : 'name';

  let children = parent.children?.filter(r => baseItems.includes(r)).map(getById);
  if (query) {
    const reg = new RegExp(query, 'i');
    children  = baseItems.filter(id => id !== parent.id && getPath(id).some(x => !!x && x.id === parent.id))
      .map(id => getById(id))
      .filter(x => x?.[field] && reg.test(x[field]));
  }

  const renderRow = (x, i) => (
    <Table.Row key={i}>
      {children.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </Table.Row>
  );

  const renderItem = (item, i) => {
    if (!item) return <Table.Cell key={i} />;

    return (
      <Table.Cell
        className={clsx('tree_item_modal_content', { 'item single_item': !(item.children.length > 0) })}
        key={i}
      >
        <TagSourceItem {...props} id={item.id} deep={-1} />
      </Table.Cell>
    );
  };

  const rows = buildRowArr(children.length);

  return (
    <Modal
      open={open}
      className={clsx('filters_aside_tree_modal', { [dir]: true })}
      size="large"
      dir={dir}
      onClose={onClose}
      closeIcon={<Icon name="times circle outline" />}
    >
      <Modal.Header className="no-border nowrap">
        {parent[field]}
        <Input
          className="search-input"
          placeholder={t(`filters.aside-filter.search-input-${isTag ? 'topic' : 'source'}`)}
          onChange={handleSetQuery}
          value={query}
        />
      </Modal.Header>
      <Modal.Content scrolling>
        <Table collapsing celled={false} basic>
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

export default withNamespaces()(TagSourceItemModal);
