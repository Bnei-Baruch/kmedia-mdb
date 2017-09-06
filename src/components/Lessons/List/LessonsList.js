import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Grid, List, Table } from 'semantic-ui-react';

import { CT_LESSON_PART } from '../../../helpers/consts';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Link from '../../Language/MultiLanguageLink';

class LessonsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.LessonCollection, shapes.LessonPart])),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: []
  };

  renderPart = (part, t) => {
    const breakdown = new CollectionsBreakdown(Object.values(part.collections || {}));

    const relatedItems = breakdown.getDailyLessons().map(x =>
      (
        <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
          {t(`constants.content-types.${x.content_type}`)} {t('values.date', { date: new Date(x.film_date) })}
        </List.Item>
      )
    ).concat(breakdown.getAllButDailyLessons().map(x => (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name}
      </List.Item>
    )));

    return (
      <Table.Row verticalAlign="top" key={part.id}>
        <Table.Cell collapsing singleLine width={1}>
          <strong>{t('values.date', { date: new Date(part.film_date) })}</strong>
        </Table.Cell>
        <Table.Cell>
          <Link to={canonicalLink(part)}>
            <strong>{part.name}</strong>
          </Link>
          {
            relatedItems.length === 0 ?
              null :
              (
                <List size="tiny" divided horizontal link>
                  <List.Item>
                    <List.Header>
                      {t('lessons.list.related')}:
                    </List.Header>
                  </List.Item>
                  {relatedItems}
                </List>
              )
          }
          <div dangerouslySetInnerHTML={{ __html: part.description }} />
        </Table.Cell>
      </Table.Row>
    );
  };

  renderCollection = (collection, t) => {
    let units = [];
    if (collection.content_units) {
      units = collection.content_units.map((unit) => {
        const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

        const relatedItems = breakdown.getDailyLessons()
          .filter(x => x.id !== collection.id)
          .map(x =>
            (
              <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
                {t(`constants.content-types.${x.content_type}`)} {t('values.date', { date: new Date(x.film_date) })}
              </List.Item>
            )
          ).concat(breakdown.getAllButDailyLessons().map(x => (
            <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
              {x.name}
            </List.Item>
          )));

        return (
          <Table.Row verticalAlign="top" key={`u-${unit.id}`}>
            <Table.Cell>
              <Link to={canonicalLink(unit)}>
                {unit.name}
              </Link>
              {
                relatedItems.length === 0 ?
                  null :
                  (
                    <List size="tiny" divided horizontal link>
                      <List.Item>
                        <List.Header>
                          {t('lessons.list.related')}:
                        </List.Header>
                      </List.Item>
                      {relatedItems}
                    </List>
                  )
              }
              <div dangerouslySetInnerHTML={{ __html: unit.description }} />
            </Table.Cell>
          </Table.Row>
        );
      });
    }

    const rows             = [];
    const contentUnitsSpan = collection.content_units ? collection.content_units.length + 1 : 1;

    rows.push((
      <Table.Row verticalAlign="top" key={`l-${collection.id}`}>
        <Table.Cell collapsing singleLine width={1} rowSpan={contentUnitsSpan}>
          <strong>{t('values.date', { date: new Date(collection.film_date) })}</strong>
        </Table.Cell>
        <Table.Cell>
          <Link to={canonicalLink(collection)}>
            <strong>{t(`constants.content-types.${collection.content_type}`)}</strong>
          </Link>
        </Table.Cell>
      </Table.Row>
    ));
    return rows.concat(units);
  };

  render() {
    const { items, t } = this.props;

    if (!items) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (
      <Table basic="very" sortable className="index-list">
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
