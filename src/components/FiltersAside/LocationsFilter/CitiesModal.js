import clsx from 'clsx';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Icon, Input, Modal, Table } from 'semantic-ui-react';

import { FN_LOCATIONS } from '../../../helpers/consts';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/filtersAside';
import { getTitle } from './helper';
import TagSourceItem from './TagSourceItem';

const ITEMS_PER_ROW = 3;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CitiesModal = ({ county, open, onClose, t }) => {

  const items = useSelector(state => selectors.cityByCountry(state.filtersAside, namespace, FN_LOCATIONS)(county));

  const dir = getLanguageDirection(language);

  if (isEmpty(items)) return null;

  const renderRow = (x, i) => (
    <Table.Row key={i} verticalAlign="top">
      {items.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
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

  const rows = buildRowArr(items.length);

  return (
    <Modal
      open={open}
      className={clsx('filters_aside_tree_modal', { [dir]: true })}
      dir={dir}
      onClose={onClose}
      closeIcon={<Icon name="times circle outline" />}
    >
      <Modal.Header className="no-border nowrap">
        {getTitle(county, t)}
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

export default withNamespaces()(CitiesModal);
