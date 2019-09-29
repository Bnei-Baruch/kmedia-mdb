import React from 'react';
import { Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { ellipsize } from '../../../../../helpers/strings';
import Link from '../../../../Language/MultiLanguageLink';
import Collection from '../../../../Pages/Collection/Container';

const PublicationCollection = () => <Collection namespace="publications-collection" renderUnit={renderUnit} />;

const renderUnit = (unit, t) => {
  const filmDate    = unit.film_date ? t('values.date', { date: unit.film_date }) : '';
  const name        = unit.name || NO_NAME;
  const description = unit.description
    ? (
      <div className="index__description mobile-hidden">
        {ellipsize(unit.description)}
      </div>
    )
    : null;

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        <span className="index__date">{filmDate}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(unit)}>{name}</Link>
        {description}
      </Table.Cell>
    </Table.Row>
  );
};

export default PublicationCollection;
