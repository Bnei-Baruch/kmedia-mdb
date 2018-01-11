import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_CHILDREN_LESSON, CT_LECTURE, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/utils';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import UnitList from '../../pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const lectures  = breakdown.getLectures();

  const relatedItems = lectures.map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name || '☠ no name'}
      </List.Item>
    )
  );

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: new Date(unit.film_date) });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine width={1}>
        <strong>{filmDate}</strong>
      </Table.Cell>
      <Table.Cell collapsing width={1}>
        <UnitLogo
          fluid
          unitId={unit.id}
          collectionId={lectures.length > 0 ? lectures[0].id : null}
        />
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(unit)}>
          <strong>{unit.name || '☠ no name'}</strong>
        </Link>
        <List horizontal divided link className="index-list__item-subtitle" size="tiny">
          <List.Item>
            <List.Header>{t('lectures.list.item_from')}</List.Header>
          </List.Item>
          {relatedItems}
        </List>
      </Table.Cell>
    </Table.Row>
  );
};

class LecturesList extends Component {

  extraFetchParams = () => ({
    content_type: [CT_LECTURE, CT_WOMEN_LESSON, CT_CHILDREN_LESSON, CT_VIRTUAL_LESSON]
  });

  render() {
    return (
      <UnitList
        namespace="lectures"
        extraFetchParams={this.extraFetchParams}
        renderUnit={renderUnit}
      />
    );
  }
}

export default LecturesList;
