import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/links';
import { ellipsize } from '../../../helpers/strings';
import Link from '../../Language/MultiLanguageLink';
import Collection from '../../Pages/Collection/Container';

class PublicationCollection extends Component {
  renderUnit = (unit, t) => {
    let filmDate = '';
    if (unit.film_date) {
      filmDate = t('values.date', { date: unit.film_date });
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
          {
            unit.description ?
              <div className="index__description mobile-hidden">
                {ellipsize(unit.description)}
              </div>
              : null
          }
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    return <Collection namespace="publications-collection" renderUnit={this.renderUnit} />;
  }
}

export default PublicationCollection;
