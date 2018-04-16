import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_ARTICLE, NO_NAME } from '../../../helpers/consts';
import { createDate } from '../../../helpers/date';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/utils';
import UnitList from '../../Pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';
import SectionHeader from '../../shared/SectionHeader';

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const articles  = breakdown.getArticles();

  const relatedItems = articles.map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name || NO_NAME}
      </List.Item>
    )
  );

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: createDate(unit.film_date) });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top" className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        <span className="index__date">{filmDate}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(unit)}>
          {unit.name || NO_NAME}
        </Link>
        <List horizontal divided link className="index__collections" size="tiny">
          <List.Item>
            <List.Header>{t('publications.list.item_from')}</List.Header>
          </List.Item>
          {relatedItems}
        </List>
      </Table.Cell>
    </Table.Row>
  );
};

class PublicationsList extends Component {
  extraFetchParams = () => ({ content_type: [CT_ARTICLE] });

  render() {
    return (
      <div>
        <SectionHeader section="publications" />
        <UnitList
          namespace="publications"
          extraFetchParams={this.extraFetchParams}
          renderUnit={renderUnit}
        />
      </div>
    );
  }
}

export default PublicationsList;
