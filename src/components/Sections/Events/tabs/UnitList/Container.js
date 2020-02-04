import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import { CT_FRIENDS_GATHERING, CT_MEAL } from '../../../../../helpers/consts';
import { ellipsize } from '../../../../../helpers/strings';
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
        {
          unit.description
            ? (
              <div className="index__description mobile-hidden">
                {ellipsize(unit.description)}
              </div>
            )
            : null
        }
        {
          relatedItems.length > 0
            ? (
              <List horizontal divided link className="index-list__item-subtitle" size="tiny">
                <List.Item>
                  <List.Header>{t('events.list.item_from')}</List.Header>
                </List.Item>
                {relatedItems}
              </List>
            )
            : null
        }
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
