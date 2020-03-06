import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import { CT_FRIENDS_GATHERING, CT_MEAL } from '../../../../../helpers/consts';
import * as renderUnitHelper from '../../../../../helpers/renderUnitHelper';
import UnitList from '../../../../Pages/UnitList/Container';

const renderUnit = (unit, t) => {
  const breakdown = renderUnitHelper.getUnitCollectionsBreakdown(unit); 
  const events    = breakdown.getEvents();

  const relatedItems = events.map(renderUnitHelper.renderUnitNameAsListItem);

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing width={1}>
        { renderUnitHelper.renderUnitLogo(unit, 'events')}
      </Table.Cell>
      <Table.Cell>
        { renderUnitHelper.renderFilmDate(unit, t) }
        { renderUnitHelper.renderUnitNameLink(unit) }
        { renderUnitHelper.renderUnitDescription(unit) }
        { renderUnitHelper.renderRelatedItems(relatedItems, t('events.list.item_from'), "index-list__item-subtitle")}
      </Table.Cell>
    </Table.Row>
  );
};

class Container extends Component {
  static propTypes = {
    tab: PropTypes.string.isRequired,
  };

  extraFetchParams = () => ({
    content_type: [this.props.tab === 'meals' ? CT_MEAL : CT_FRIENDS_GATHERING]
  });

  render() {
    return (
      <UnitList
        namespace={`events-${this.props.tab}`}
        extraFetchParams={this.extraFetchParams}
        renderUnit={renderUnit}
      />
    );
  }
}

export default Container;
