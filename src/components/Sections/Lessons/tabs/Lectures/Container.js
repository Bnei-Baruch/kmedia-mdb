import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import { CT_LECTURE, CT_LESSON_PART, CT_VIRTUAL_LESSON, CT_WOMEN_LESSON, NO_NAME, RABASH_PERSON_UID } from '../../../../../helpers/consts';
import { sectionThumbnailFallback } from '../../../../../helpers/images';
import { CollectionsBreakdown } from '../../../../../helpers/mdb';
import { canonicalLink } from '../../../../../helpers/links';
import { ellipsize } from '../../../../../helpers/strings';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../shared/Logo/UnitLogo';

const renderUnit = (unit, t, namespace) => {
  if (!unit)
    return null;
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const lectures  = breakdown.getLectures();
  const map = x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name || NO_NAME}
    </List.Item>
  );

  const relatedItems = lectures.map(map);

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: unit.film_date });
  }
  const link = canonicalLink(unit);

  if (namespace === 'lessons-rabash') {
    return (
      <Table.Row className="no-thumbnail" key={unit.id} verticalAlign="top">
        <Table.Cell>
          <Link className="index__title" to={link}>
            {unit.name || NO_NAME}
          </Link>
          {
            unit.description
              ? (
                <div className="index__description mobile-hidden">
                  {ellipsize(unit.description)}
                </div>
              )
              : null
          }
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine>
        <Link to={link}>
          <UnitLogo
            className="index__thumbnail"
            unitId={unit.id}
            collectionId={lectures.length > 0 ? lectures[0].id : null}
            fallbackImg={sectionThumbnailFallback.lectures}
          />
        </Link>
      </Table.Cell>
      <Table.Cell>
        <span className="index__date">{filmDate}</span>
        <Link className="index__title" to={link}>
          {unit.name || NO_NAME}
        </Link>
        {
          unit.description
            ? (
              <div className="index__description mobile-hidden">
                {ellipsize(unit.description)}
              </div>
            )
            : null
        }
        {
          relatedItems.length > 0
            ? (
              <List horizontal divided link className="index__collections" size="tiny">
                <List.Item>
                  <List.Header>{t('lessons.list.item_from')}</List.Header>
                </List.Item>
                {relatedItems}
              </List>
            )
            : null
        }
      </Table.Cell>
    </Table.Row>
  );
};

class Container extends Component {
  static propTypes = {
    tab: PropTypes.string.isRequired,
  };

  extraFetchParams = () => {
    let ct;
    let person;
    switch (this.props.tab) {
    case 'virtual':
      ct = [CT_VIRTUAL_LESSON];
      break;
    case 'lectures':
      ct = [CT_LECTURE];
      break;
    case 'women':
      ct = [CT_WOMEN_LESSON];
      break;
    case 'rabash':
      ct     = [CT_LESSON_PART];
      person = RABASH_PERSON_UID;
      break;
      // case 'children':
      //   ct = [CT_CHILDREN_LESSON];
      //   break;
    default:
      ct = [CT_VIRTUAL_LESSON];
      break;
    }

    return { content_type: ct, person };
  };

  render() {
    return (
      <UnitList
        namespace={`lessons-${this.props.tab}`}
        extraFetchParams={this.extraFetchParams}
        renderUnit={renderUnit}
      />
    );
  }
}

export default Container;
