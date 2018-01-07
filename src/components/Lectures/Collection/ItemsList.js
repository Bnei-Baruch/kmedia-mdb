import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, List, Table } from 'semantic-ui-react';

import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';

class ItemsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.ContentUnit),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: []
  };

  renderItem = (unit) => {
    const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
    const lectures  = breakdown.getLectures();

    const relatedItems = lectures.map(x =>
      (
        <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
          {x.name || '☠ no name'}
        </List.Item>
      )
    );

    const t = this.props.t;

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

  render() {
    const { items } = this.props;

    if (!Array.isArray(items) || items.length === 0) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table sortable basic="very" className="index-list">
        <Table.Body>
          {items.map(this.renderItem)}
        </Table.Body>
      </Table>
    );
  }
}

export default translate()(ItemsList);
