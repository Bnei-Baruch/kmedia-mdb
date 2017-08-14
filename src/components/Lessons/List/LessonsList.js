import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, Table } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';
import { CT_LESSON_PART } from '../../../helpers/consts';
import * as shapes from '../../shapes';

class LessonsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: []
  };

  renderPart = (part, t) => (
    <Table.Row verticalAlign="top" key={part.id}>
      <Table.Cell collapsing singleLine width={1}>
        <strong>{t('values.date', { date: new Date(part.film_date) })}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={`/lessons/part/${part.id}`}>
          <strong>{part.name}</strong>
          <br />
          <div dangerouslySetInnerHTML={{ __html: part.description }} />
        </Link>
      </Table.Cell>
    </Table.Row>
  );

  renderCollection = (collection, t) => {
    const units = collection.content_units.map(unit => (
      <Table.Row verticalAlign="top" key={`u-${unit.id}`}>
        <Table.Cell>
          <Link to={`/lessons/part/${unit.id}`}>
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
          <strong>{t('values.date', { date: new Date(collection.film_date) })}</strong>
        </Table.Cell>
        <Table.Cell>
          <Link to={`/lessons/full/${collection.id}`}>
            <strong>{t(`constants.content-types.${collection.content_type}`)}</strong>
          </Link>
        </Table.Cell>
      </Table.Row>
    ));
    rows = rows.concat(units);

    return rows;
  };

  render() {
    const { items, t } = this.props;

    if (!items) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table basic="very" sortable>
        <Table.Body>
          {
            items.map(x => (
              x.content_type === CT_LESSON_PART ?
                this.renderPart(x, t) :
                this.renderCollection(x, t))
            )
          }
        </Table.Body>
      </Table>
    );
  }
}

export default translate()(LessonsList);
