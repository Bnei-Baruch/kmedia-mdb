import clsx from 'clsx';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, Icon, Input, Modal, Table } from 'semantic-ui-react';
import {
  CT_CLIP,
  CT_CLIPS,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER
} from '../../../helpers/consts';

import CollectionItem from '../../FiltersAside/CollectionFilter/CollectionItem';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const ITEMS_PER_ROW = 5;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

export const cCtByUnitCt = {
  [CT_VIDEO_PROGRAM_CHAPTER]: CT_VIDEO_PROGRAM,
  [CT_CLIP]                 : CT_CLIPS,
  [CT_VIDEO_PROGRAM]        : CT_VIDEO_PROGRAM_CHAPTER,
  [CT_CLIPS]                : CT_CLIP
};

const CollectionsModal = ({ namespace, items, selectedCT, onClose, t }) => {
  const [query, setQuery] = useState('');

  const uiDir = useSelector(settingsGetUIDirSelector);

  const reg         = new RegExp(query, 'i');
  const collections = items.filter(x => !query || (x.name && reg.test(x.name)));

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
      open={!!selectedCT}
      dir={uiDir}
      onClose={handleClose}
      className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
      closeIcon={<Icon name="times circle outline"/>}
      size="fullscreen"
    >
      <Modal.Header className="no-border nowrap">
        {t(`filters.content-types.${selectedCT}`)}
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

export default withTranslation()(CollectionsModal);
