import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { fromToLocalized } from '../../../../../helpers/date';
import * as shapes from '../../../../shapes';
import Link from '../../../../Language/MultiLanguageLink';


const renderCollection = (collection) => {
  const localDate = fromToLocalized(collection.start_date, collection.end_date);

  return (
    <Table.Row className="no-thumbnail" verticalAlign="top" key={collection.id}>
      <Table.Cell collapsing singleLine>
        <span className="index__date">{localDate}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(collection)}>
          {collection.name || NO_NAME}
        </Link>
      </Table.Cell>
    </Table.Row>
  );
};

const EventsList = ({ items = [], t }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return <div>{t('events.no-matches')}</div>;
  }

  return (
    <Table unstackable basic="very" className="index">
      <Table.Body>
        {items.map(renderCollection)}
      </Table.Body>
    </Table>
  );
}

EventsList.propTypes = {
  items: PropTypes.arrayOf(shapes.EventCollection),
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(EventsList);
