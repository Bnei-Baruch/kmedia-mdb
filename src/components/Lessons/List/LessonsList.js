import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { CT_LESSON_PART } from '../../../helpers/consts';
import * as shapes from '../../shapes';

class LessonsList extends PureComponent {

  static propTypes = {
    lessons: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
  };

  static defaultProps = {
    lessons: []
  };

  renderPart = part => (
    <Table.Row verticalAlign="top" key={part.id}>
      <Table.Cell collapsing singleLine width={1}>
        <strong>{part.film_date}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={`/lessons/${part.id}`}>
          <strong>{part.name}</strong>
          <br />
          <div dangerouslySetInnerHTML={{ __html: part.description }} />
        </Link>
      </Table.Cell>
    </Table.Row>
  );

  renderCollection = (collection) => {
    const units = collection.content_units.map(unit => (
      <Table.Row verticalAlign="top" key={`u-${unit.id}`}>
        <Table.Cell>
          <Link to={`/lessons/${unit.id}`}>
            {unit.name}
            <br />
            <div dangerouslySetInnerHTML={{ __html: unit.description }} />
          </Link>
        </Table.Cell>
      </Table.Row>
    ));

    let rows = [];
    rows.push((
      <Table.Row verticalAlign="top" key={`l-${collection.id}`}>
        <Table.Cell collapsing singleLine width={1} rowSpan={collection.content_units.length + 1}>
          <strong>{collection.film_date}</strong>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/lessons/c/${collection.id}`}>
            <strong>{collection.content_type}</strong>
          </Link>
        </Table.Cell>
      </Table.Row>
    ));
    rows = rows.concat(units);

    return rows;
  };

  render() {
    const { lessons } = this.props;

    if (!lessons) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table basic="very" sortable>
        <Table.Body>
          {
            lessons.map(x => (
              x.content_type === CT_LESSON_PART ?
                this.renderPart(x) :
                this.renderCollection(x))
            )
          }
        </Table.Body>
      </Table>
    );
  }
}

export default LessonsList;
