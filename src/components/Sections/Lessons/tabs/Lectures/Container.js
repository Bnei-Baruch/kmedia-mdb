import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { CT_LECTURE, CT_LESSON_PART, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, RABASH_PERSON_UID } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';

const renderUnit = (unit, t, namespace) => {
  if (!unit) {
    return null;
  }

  const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit);
  const lectures  = breakdown.getLectures();
  const relatedItems = lectures.map(renderUnitHelper.renderUnitNameAsListItem);

  if (namespace === 'lessons-rabash') {
    return (
      <Table.Row className="no-thumbnail" key={unit.id} verticalAlign="top">
        <Table.Cell>
          { renderUnitHelper.renderUnitNameLink(unit)}
          { renderUnitHelper.renderUnitDescription(unit) }
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        { renderUnitHelper.renderUnitCollectionLogo(unit, 'lectures', lectures.length > 0 ? lectures[0].id : null)}
      </Table.Cell>
      <Table.Cell>
        { renderUnitHelper.renderUnitFilmDate(unit, t)}
        { renderUnitHelper.renderUnitNameLink(unit)}
        { renderUnitHelper.renderUnitDescription(unit)}
        { renderUnitHelper.renderRelatedItems(relatedItems, t('lessons.list.item_from')) }
      </Table.Cell>
    </Table.Row>
  );
};

class Container extends Component {
  static propTypes = {
    tab: PropTypes.string.isRequired,
  };

  extraFetchParams = () => {
    let ct;
    let person;
    switch (this.props.tab) {
    case 'virtual':
      ct = [CT_VIRTUAL_LESSON];
      break;
    case 'lectures':
      ct = [CT_LECTURE];
      break;
    case 'women':
      ct = [CT_WOMEN_LESSON];
      break;
    case 'rabash':
      ct     = [CT_LESSON_PART];
      person = RABASH_PERSON_UID;
      break;
      // case 'children':
      //   ct = [CT_CHILDREN_LESSON];
      //   break;
    default:
      ct = [CT_VIRTUAL_LESSON];
      break;
    }

    return { content_type: ct, person };
  };

  render() {
    return (
      <UnitList
        namespace={`lessons-${this.props.tab}`}
        extraFetchParams={this.extraFetchParams}
        renderUnit={renderUnit}
      />
    );
  }
}

export default Container;
