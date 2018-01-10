import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'semantic-ui-react';

import { DATE_FORMAT } from '../../../../helpers/consts';
import { canonicalLink } from '../../../../helpers/utils';
import { fromToLocalized } from '../../../../helpers/date';
import * as shapes from '../../../shapes';
import Link from '../../../Language/MultiLanguageLink';

class EventsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.EventCollection),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: []
  };

  renderCollection = (collection) => {
    const localDate = fromToLocalized(
      moment.utc(collection.start_date, DATE_FORMAT),
      moment.utc(collection.end_date, DATE_FORMAT)
    );

    return (
      <Table.Row verticalAlign="top" key={collection.id}>
        <Table.Cell collapsing singleLine width={1}>
          <strong>{localDate}</strong>
        </Table.Cell>
        <Table.Cell>
          <Link to={canonicalLink(collection)}>
            <strong>{collection.name || '⛔ NO NAME'}</strong>
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { items, t } = this.props;

    if (!Array.isArray(items) || items.length === 0) {
      return <div>{t('events.no-matches')}</div>;
    }

    return (
      <Table basic="very" sortable>
        <Table.Body>
          {items.map(this.renderCollection)}
        </Table.Body>
      </Table>
    );
  }
}

export default EventsList;
