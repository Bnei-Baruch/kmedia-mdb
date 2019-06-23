import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/links';
import { ellipsize } from '../../../../helpers/strings';
import Link from '../../../Language/MultiLanguageLink';
import UnitLogo from '../../../shared/Logo/UnitLogo';
import Collection from '../../../Pages/Collection/Container';

export const renderUnit = (unit, t) => {
  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: unit.film_date });
  }

  const link = canonicalLink(unit);

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        <Link to={link}>
          <UnitLogo className="index__thumbnail" unitId={unit.id} fallbackImg='lectures' />
        </Link>
      </Table.Cell>
      <Table.Cell>
        <span className="index__date">{filmDate}</span>
        <Link className="index__title" to={link}>
          {unit.name || NO_NAME}
        </Link>
        {
          unit.description
            ? (
              <div className="index__description mobile-hidden">
                {ellipsize(unit.description)}
              </div>
            )
            : null
        }
      </Table.Cell>
    </Table.Row>
  );
};

class LectureCollection extends Component {
  render() {
    return <Collection namespace="lessons-collection" renderUnit={renderUnit} />;
  }
}

export default LectureCollection;
