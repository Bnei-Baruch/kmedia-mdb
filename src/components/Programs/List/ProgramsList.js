import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, Image, List, Table } from 'semantic-ui-react';

import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

class ProgramsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.ProgramChapter),
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
      <Table.Row key={part.id} verticalAlign="top">
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
          <List horizontal link size="tiny">
            <List.Item>
              <List.Header>{t('programs.list.episode_from')}</List.Header>
            </List.Item>
            {relatedItems}
          </List>
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { items, t } = this.props;

    if (!Array.isArray(items) || items.length === 0) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table sortable basic="very" className="index-list">
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
