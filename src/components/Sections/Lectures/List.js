import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_CHILDREN_LESSON, CT_LECTURE, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, NO_NAME } from '../../../helpers/consts';
import { createDate } from '../../../helpers/date';
import { sectionThumbnailFallback } from '../../../helpers/images';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/utils';
import UnitList from '../../Pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import SectionHeader from '../../shared/SectionHeader';

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const lectures  = breakdown.getLectures();

  const relatedItems = lectures.map(x =>
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
  const link = canonicalLink(unit);

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        <Link to={link}>
          <UnitLogo
            className="index__thumbnail"
            unitId={unit.id}
            collectionId={lectures.length > 0 ? lectures[0].id : null}
            fallbackImg={sectionThumbnailFallback.lectures}
          />
        </Link>
      </Table.Cell>
      <Table.Cell>
        <span className="index__date">{filmDate}</span>
        <Link className="index__title" to={link}>
          {unit.name || NO_NAME}
        </Link>
        {
          unit.description ?
            <span className="index__description mobile-hidden">
              {unit.description}
            </span>
            : null
        }
        {
          relatedItems.length > 0 ?
            <List horizontal divided link className="index__collections" size="tiny">
              <List.Item>
                <List.Header>{t('lectures.list.item_from')}</List.Header>
              </List.Item>
              {relatedItems}
            </List>
            : null
        }
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
      <div>
        <SectionHeader section="lectures" />
        <UnitList
          namespace="lectures"
          extraFetchParams={this.extraFetchParams}
          renderUnit={renderUnit}
        />
      </div>
    );
  }
}

export default LecturesList;
