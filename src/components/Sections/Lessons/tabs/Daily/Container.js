import React from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_DAILY_LESSON, CT_LESSON_PART } from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import { selectors as mdb } from '../../../../../redux/modules/mdb';
import { selectors as lists } from '../../../../../redux/modules/lists';
import { mapState as baseMapState, UnitListContainer, wrap } from '../../../../Pages/UnitListAsTable/Container';
import Link from '../../../../Language/MultiLanguageLink';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;

const map1Func = t => x => (
  <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
    {t(CT_DAILY_LESSON_I18N_KEY)}
    {' '}
    {t('values.date', { date: x.film_date })}
  </List.Item>
);

const renderUnit = (unit, t) => {
  const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit);

  const map1 = map1Func(t);

  const relatedItems = breakdown.getDailyLessons()
    .map(map1)
    .concat(breakdown.getAllButDailyLessons().map(renderUnitHelper.renderUnitNameAsListItem));

  return (
    <Table.Row verticalAlign="top" key={unit.id} className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        {renderUnitHelper.renderUnitFilmDate(unit, t)}
      </Table.Cell>
      <Table.Cell>
        {renderUnitHelper.renderUnitNameLink(unit)}
        {renderUnitHelper.renderRelatedItems(relatedItems, t('lessons.list.related'))}
      </Table.Cell>
    </Table.Row>
  );
};

export const renderCollection = (collection, t) => {
  let units = [];

  const { number, id, content_units, film_date } = collection;
  if (content_units) {
    units = content_units.map(unit => {
      const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit);
      const map1      = map1Func(t);

      const relatedItems = breakdown.getDailyLessons()
        .filter(x => x.id !== id)
        .map(map1)
        .concat(breakdown.getAllButDailyLessons().map(renderUnitHelper.renderUnitNameAsListItem));

      return (
        <Table.Row key={`u-${unit.id}`} verticalAlign="top" className="no-thumbnail">
          <Table.Cell>
            {renderUnitHelper.renderUnitNameLink(unit, 'index__item')}
            {renderUnitHelper.renderRelatedItems(relatedItems, t('lessons.list.related'))}
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  const rows   = [];
  const cuSpan = content_units ? content_units.length + 1 : 1;

  rows.push((
    <Table.Row key={`l-${id}`} verticalAlign="top" className="no-thumbnail">
      <Table.Cell collapsing singleLine rowSpan={cuSpan}>
        <span className="index__date">{t('values.date', { date: film_date })}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(collection)}>
          {`${t(CT_DAILY_LESSON_I18N_KEY)}${number ? ` (${t('lessons.list.nameByNum_' + number)})` : ''}`}
        </Link>
      </Table.Cell>
    </Table.Row>
  ));

  return rows.concat(units);
};

export const renderUnitOrCollection = (item, t) => {
  if (!item) {
    return null;
  }

  return item.content_type === CT_LESSON_PART
    ? renderUnit(item, t)
    : renderCollection(item, t);
};

const mapState = (state, ownProps) => {
  const nsState = lists.getNamespaceState(state.lists, ownProps.namespace);

  return {
    ...baseMapState(state, ownProps),
    items: (nsState.items || []).map(x => (
      x[1] === CT_LESSON_PART
        ? mdb.getDenormContentUnit(state.mdb, x[0])
        : mdb.getDenormCollectionWUnits(state.mdb, x[0]))
    ),
  };
};

const MyUnitList = wrap(UnitListContainer, mapState);

const LessonsList = () =>
  <MyUnitList
    namespace="lessons-daily"
    renderUnit={renderUnitOrCollection}
  />;

export default LessonsList;
