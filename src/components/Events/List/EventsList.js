import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Table } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';

class EventsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.EventCollection, shapes.EventItem])),
  };

  static defaultProps = {
    items: []
  };

  renderCollection = (collection) => {
    let units = [];
    if (collection.content_units) {
      units = collection.content_units.map(unit => (
        <Table.Row verticalAlign="top" key={`u-${unit.id}`}>
          <Table.Cell>
            <Link to={`/events/item/${unit.id}`}>
              {unit.name || '☠ no name'}
              <br />
              <div dangerouslySetInnerHTML={{ __html: unit.description }} />
            </Link>
          </Table.Cell>
        </Table.Row>
      ));
    }

    const rows = [];
    const contentUnitsSpan = collection.content_units ? collection.content_units.length + 1 : 1;

    rows.push((
      <Table.Row verticalAlign="top" key={`l-${collection.id}`}>
        <Table.Cell collapsing singleLine width={1} rowSpan={contentUnitsSpan}>
          <Link to={`/events/full/${collection.id}`}>
            <strong>{collection.name || '⛔ NO NAME'}</strong>
          </Link>
        </Table.Cell>
      </Table.Row>
    ));

    return rows.concat(units);
  };

  render() {
    const { items } = this.props;

    if (!Array.isArray(items) || items.length === 0) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table basic="very" sortable>
        <Table.Body>
          {
            items.map(x => (this.renderCollection(x)))
          }
        </Table.Body>
      </Table>
    );
  }
}

export default EventsList;
