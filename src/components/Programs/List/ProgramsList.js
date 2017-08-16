import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { CT_VIDEO_PROGRAM_CHAPTER } from '../../../helpers/consts';
import * as shapes from '../../shapes';

class ProgramsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.ProgramCollection, shapes.ProgramChapter])),
  };

  static defaultProps = {
    items: []
  };

  renderPart = part => (
    <Table.Row verticalAlign="top" key={part.id}>
      <Table.Cell collapsing singleLine width={1}>
        <strong>{part.film_date}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={`/programs/chapter/${part.id}`}>
          <strong>{part.name}</strong>
          <br />
          <div dangerouslySetInnerHTML={{ __html: part.description }} />
        </Link>
      </Table.Cell>
    </Table.Row>
  );

  renderCollection = (collection) => {
    let units = [];
    if (collection.content_units) {
      units = collection.content_units.slice(0, 5).map(unit => (
        <Table.Row verticalAlign="top" key={`u-${unit.id}`}>
          <Table.Cell>
            <Link to={`/programs/chapter/${unit.id}`}>
              {unit.name || '☠ no name'}
              <br />
              <div dangerouslySetInnerHTML={{ __html: unit.description }} />
            </Link>
          </Table.Cell>
        </Table.Row>
      ));
    }

    const rows = [];
    const contentUnitsSpan = units.length + 1;

    rows.push((
      <Table.Row verticalAlign="top" key={`l-${collection.id}`}>
        <Table.Cell collapsing singleLine width={1} rowSpan={contentUnitsSpan}>
          <Link to={`/programs/full/${collection.id}`}>
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
            items.map(x => (
              x.content_type === CT_VIDEO_PROGRAM_CHAPTER ?
                this.renderPart(x) :
                this.renderCollection(x))
            )
          }
        </Table.Body>
      </Table>
    );
  }
}

export default ProgramsList;
