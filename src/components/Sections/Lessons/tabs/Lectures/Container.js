import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { CT_LECTURE, CT_LESSON_PART, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, RABASH_PERSON_UID } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitListAsTable/Container';

const renderUnit = (unit, t, namespace) => {
  if (!unit) {
    return null;
  }

  const breakdown    = renderUnitHelper.getUnitCollectionsBreakdown(unit);
  const lectures     = breakdown.getLectures();
  const relatedItems = lectures.map(renderUnitHelper.renderUnitNameAsListItem);

  if (namespace === 'lessons-rabash') {
    return (
      <Table.Row className="no-thumbnail" key={unit.id} verticalAlign="top">
        <Table.Cell>
          {renderUnitHelper.renderUnitNameLink(unit)}
          {renderUnitHelper.renderUnitDescription(unit)}
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        {renderUnitHelper.renderUnitCollectionLogo(unit, 'lectures', lectures.length > 0 ? lectures[0].id : null)}
      </Table.Cell>
      <Table.Cell>
        {renderUnitHelper.renderUnitFilmDate(unit, t)}
        {renderUnitHelper.renderUnitNameLink(unit)}
        {renderUnitHelper.renderUnitDescription(unit)}
        {renderUnitHelper.renderRelatedItems(relatedItems, t('lessons.list.item_from'))}
      </Table.Cell>
    </Table.Row>
  );
};

const mapTabToCt = new Map([
  ['virtual', { content_type: CT_VIRTUAL_LESSON, }],
  ['lectures', { content_type: CT_LECTURE, }],
  ['women', { content_type: CT_WOMEN_LESSON, }],
  ['rabash', { content_type: CT_LESSON_PART, person: RABASH_PERSON_UID, }],
  // ['children', [CT_CHILDREN_LESSON, null]],
]);

const Container = props => {
  const { tab }          = props;
  const extraFetchParams = mapTabToCt.get(tab) || { content_type: CT_VIRTUAL_LESSON, };
  return (
    <UnitList
      key={tab}
      namespace={`lessons-${tab}`}
      extraFetchParams={extraFetchParams}
      renderUnit={renderUnit}
    />
  );
};

Container.propTypes = {
  tab: PropTypes.string.isRequired,
};

export default Container;
