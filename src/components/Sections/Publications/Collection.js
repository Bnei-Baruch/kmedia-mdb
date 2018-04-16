import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../helpers/consts';
import { createDate } from '../../../helpers/date';
import { canonicalLink } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import Collection from '../../Pages/Collection/Container';

export const renderUnit = (unit, t) => {
  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: createDate(unit.film_date) });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        <span className="index__date">{filmDate}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(unit)}>
          {unit.name || NO_NAME}
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
