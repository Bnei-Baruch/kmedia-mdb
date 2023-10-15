import clsx from 'clsx';
import React, { useState } from 'react';
import { withTranslation, useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { Button, Icon, Input, Modal, Table } from 'semantic-ui-react';

import { FN_TOPICS_MULTI } from '../../../../src/helpers/consts';
import { isEmpty } from '../../../../src/helpers/utils';
import { selectors as settings } from '../../../redux/slices/settingsSlice/settingsSlice';
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
          getPath
        } = props;

  const [query, setQuery] = useState('');

  const uiDir = useSelector(state => settings.getUIDir(state.settings));
  const { t } = useTranslation();

  if (!parent || !parent.children) return null;

  const handleSetQuery = (e, data) => setQuery(data.value);

  const handleClose = () => {
    setQuery(null);
    onClose();
  };

  const isTag = filterName === FN_TOPICS_MULTI;
  const field = isTag ? 'label' : 'name';

  let children = parent.children?.filter(r => baseItems.includes(r)).map(getById);
  if (query) {
    const reg = new RegExp(query, 'i');
    children  = baseItems.filter(id => id !== parent.id && getPath(id).some(x => !!x && x.id === parent.id))
      .map(id => getById(id))
      .filter(x => x?.[field] && reg.test(x[field]));
  }

  if (isEmpty(children)) return null;

  const renderRow = (x, i) => (
    <Table.Row key={i} verticalAlign="top">
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
      className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
      dir={uiDir}
      onClose={handleClose}
      closeIcon={<Icon name="times circle outline" />}
    >
      <Modal.Header className="no-border">
        <div>{parent[field]}</div>
        <Input
          className="search-input"
          placeholder={t('sources-library.filter')}
          onChange={handleSetQuery}
          defaultValue={query}
        />
      </Modal.Header>
      <Modal.Content scrolling>
        <Table collapsing celled={false} basic>
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
  );
};

export default TagSourceItemModal;
