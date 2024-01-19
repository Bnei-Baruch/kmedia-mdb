import clsx from 'clsx';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button, Icon, Modal, Table } from 'semantic-ui-react';

import { FN_LOCATIONS } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import CityItem from './CityItem';
import { getTitle } from './helper';
import { filtersAsideCitiesByCountrySelector, settingsGetUIDirSelector } from '../../../redux/selectors';

const ITEMS_PER_ROW = 3;
const buildRowArr   = n => {
  const abs = n % ITEMS_PER_ROW;
  const len = (n - abs) / ITEMS_PER_ROW + ((abs === 0) ? 0 : 1);
  return Array(len).fill(0);
};

const CitiesModal = ({ country, namespace, open, onClose, t }) => {

  const items = useSelector(state => filtersAsideCitiesByCountrySelector(state, namespace, FN_LOCATIONS))(country);

  const uiDir = useSelector(settingsGetUIDirSelector);

  if (isEmpty(items)) return null;

  const renderRow = (x, i) => (
    <Table.Row key={i} verticalAlign="top">
      {items.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW).map(renderItem)}
    </Table.Row>
  );

  const renderItem = (item, i) => {
    if (!item) return <Table.Cell key={i}/>;

    return (
      <Table.Cell className="tree_item_modal_content" key={i}>
        <CityItem namespace={namespace} id={item} country={country}/>
      </Table.Cell>
    );
  };

  const rows = buildRowArr(items.length);

  return (
    <Modal
      open={open}
      className={clsx('filters_aside_tree_modal', { [uiDir]: true })}
      dir={uiDir}
      onClose={onClose}
      closeIcon={<Icon name="times circle outline"/>}
    >
      <Modal.Header className="no-border nowrap">
        {getTitle(country, t)}
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
        <Button primary content={t('buttons.close')} onClick={onClose}/>
      </Modal.Actions>
    </Modal>
  );
};

export default withTranslation()(CitiesModal);
