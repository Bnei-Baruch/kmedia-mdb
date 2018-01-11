import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_DAILY_LESSON, CT_LESSON_PART } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/utils';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as lists } from '../../../redux/modules/lists';
import { mapState as baseMapState, UnitListContainer, wrap } from '../../Pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';
import SectionHeader from '../../shared/SectionHeader';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

  const relatedItems = breakdown.getDailyLessons().map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {t(CT_DAILY_LESSON_I18N_KEY)} {t('values.date', { date: new Date(x.film_date) })}
      </List.Item>
    )
  ).concat(breakdown.getAllButDailyLessons().map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name}
    </List.Item>
  )));

  return (
    <Table.Row verticalAlign="top" key={unit.id}>
      <Table.Cell collapsing singleLine width={1}>
        <strong>{t('values.date', { date: new Date(unit.film_date) })}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(unit)}>
          <strong>{unit.name}</strong>
        </Link>
        {
          relatedItems.length === 0 ?
            null :
            (
              <List divided horizontal link className="index-list__item-subtitle" size="tiny">
                <List.Item>
                  <List.Header>
                    {t('lessons.list.related')}:
                  </List.Header>
                </List.Item>
                {relatedItems}
              </List>
            )
        }
      </Table.Cell>
    </Table.Row>
  );
};

export const renderCollection = (collection, t) => {
  let units = [];
  if (collection.content_units) {
    units = collection.content_units.map((unit) => {
      const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

      const relatedItems = breakdown.getDailyLessons()
        .filter(x => x.id !== collection.id)
        .map(x =>
          (
            <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
              {t(CT_DAILY_LESSON_I18N_KEY)} {t('values.date', { date: new Date(x.film_date) })}
            </List.Item>
          )
        ).concat(breakdown.getAllButDailyLessons().map(x => (
          <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
            {x.name}
          </List.Item>
        )));

      return (
        <Table.Row key={`u-${unit.id}`} verticalAlign="top">
          <Table.Cell>
            <Link to={canonicalLink(unit)}>
              {unit.name}
            </Link>
            {
              relatedItems.length === 0 ?
                null :
                (
                  <List className="index-list__item-subtitle" size="tiny" divided horizontal link>
                    <List.Item>
                      <List.Header>
                        {t('lessons.list.related')}:
                      </List.Header>
                    </List.Item>
                    {relatedItems}
                  </List>
                )
            }
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  const rows   = [];
  const cuSpan = collection.content_units ? collection.content_units.length + 1 : 1;

  rows.push((
    <Table.Row key={`l-${collection.id}`} verticalAlign="top">
      <Table.Cell collapsing singleLine width={1} rowSpan={cuSpan}>
        <strong>{t('values.date', { date: new Date(collection.film_date) })}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(collection)}>
          <strong>{t(CT_DAILY_LESSON_I18N_KEY)}</strong>
        </Link>
      </Table.Cell>
    </Table.Row>
  ));

  return rows.concat(units);
};

export const renderUnitOrCollection = (item, t) => {
  return item.content_type === CT_LESSON_PART ?
    renderUnit(item, t) :
    renderCollection(item, t);
};

const mapState = (state, ownProps) => {
  const nsState = lists.getNamespaceState(state.lists, ownProps.namespace);

  return {
    ...baseMapState(state, ownProps),
    items: (nsState.items || []).map(x =>
      x[1] === CT_LESSON_PART ?
        mdb.getDenormContentUnit(state.mdb, x[0]) :
        mdb.getDenormCollectionWUnits(state.mdb, x[0])),
  };
};

const MyUnitList = wrap(UnitListContainer, mapState);

class LessonsList extends Component {

  render() {
    return (
      <div>
        <SectionHeader section="lessons" />
        <MyUnitList
          namespace="lessons"
          renderUnit={renderUnitOrCollection}
        />
      </div>
    );
  }
}

export default LessonsList;
