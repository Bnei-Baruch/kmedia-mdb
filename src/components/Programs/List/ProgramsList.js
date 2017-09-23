import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, Image, List, Table } from 'semantic-ui-react';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';

class ProgramsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.ProgramCollection, shapes.ProgramChapter])),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: []
  };

  renderPart = (part, t) => {
    const breakdown = new CollectionsBreakdown(Object.values(part.collections || {}));

    const relatedItems = breakdown.getPrograms().map(x =>
      (
        <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
          {x.name || '☠ no name'}
        </List.Item>
      )
    ).concat(breakdown.getAllButPrograms().map(x => (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name}
      </List.Item>
    )));

    return (
      <Table.Row verticalAlign="top" key={part.id}>
        <Table.Cell collapsing singleLine width={1}>
          <strong>{part.film_date || '0000-00-00'}</strong>
        </Table.Cell>
        <Table.Cell collapsing width={1}>
          <Image fluid src="http://www.kab.co.il/images/attachments/91/276191_medium.jpg" />
        </Table.Cell>
        <Table.Cell>
          <Link to={canonicalLink(part)}>
            <strong>{part.name || '☠ no name'}</strong>
          </Link>
          <List size="tiny" horizontal link>
            <List.Item>
              <List.Header>{t('programs.list.episode_from')}</List.Header>
            </List.Item>
            {relatedItems}
          </List>
        </Table.Cell>
      </Table.Row>
    );
  };

  /* renderCollection = (collection) => {
    let units = [];
    if (collection.content_units) {
      units = collection.content_units.slice(0, 5).map(unit => (
        <Table.Row verticalAlign="top" key={`u-${unit.id}`}>
          <Table.Cell>
            <Link to={`/programs/chapter/${unit.id}`}>
              {unit.name || '☠ no name'}
            </Link>
          </Table.Cell>
        </Table.Row>
      ));
    }

    const rows             = [];
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
  }; */

  render() {
    const { items, t } = this.props;

    if (!Array.isArray(items) || items.length === 0) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table basic="very" sortable className="index-list">
        <Table.Body>
          {
            items.map(x => this.renderPart(x, t))
          }
        </Table.Body>
      </Table>
    );
  }
}

export default translate()(ProgramsList);
