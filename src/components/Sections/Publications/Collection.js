import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import { canonicalLink } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import Collection from '../../Pages/Collection/Container';

export const renderUnit = (unit, t) => {
  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: new Date(unit.film_date) });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine width={1}>
        <strong>{filmDate}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(unit)}>
          <strong>{unit.name || '☠ no name'}</strong>
        </Link>
      </Table.Cell>
    </Table.Row>
  );
};

class PublicationCollection extends Component {

  render() {
    return <Collection namespace="publications-collection" renderUnit={renderUnit} />;
  }
}

export default PublicationCollection;
