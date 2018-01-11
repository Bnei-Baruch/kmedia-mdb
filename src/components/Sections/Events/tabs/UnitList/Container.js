import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import { CT_FRIENDS_GATHERING, CT_MEAL } from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/utils';
import { CollectionsBreakdown } from '../../../../../helpers/mdb';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../shared/Logo/UnitLogo';

const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const events    = breakdown.getEvents();

  const relatedItems = events.map(x =>
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
        <UnitLogo fluid unitId={unit.id} />
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(unit)}>
          <strong>{unit.name || '☠ no name'}</strong>
        </Link>
        {
          relatedItems.length > 0 ?
            <List horizontal divided link className="index-list__item-subtitle" size="tiny">
              <List.Item>
                <List.Header>{t('events.list.item_from')}</List.Header>
              </List.Item>
              {relatedItems}
            </List> :
            null
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
