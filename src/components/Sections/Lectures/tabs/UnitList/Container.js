import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Table } from 'semantic-ui-react';

import {
  CT_CHILDREN_LESSON,
  CT_LECTURE,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON,
  NO_NAME
} from '../../../../../helpers/consts';
import { sectionThumbnailFallback } from '../../../../../helpers/images';
import { CollectionsBreakdown } from '../../../../../helpers/mdb';
import { ellipsize } from '../../../../../helpers/strings';
import { canonicalLink } from '../../../../../helpers/utils';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../shared/Logo/UnitLogo';

const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const lectures  = breakdown.getLectures();

  const relatedItems = lectures.map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name || NO_NAME}
      </List.Item>
    )
  );

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: unit.film_date });
  }
  const link = canonicalLink(unit);

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
          unit.description ?
            <div className="index__description mobile-hidden">
              {ellipsize(unit.description)}
            </div>
            : null
        }
        {
          relatedItems.length > 0 ?
            <List horizontal divided link className="index__collections" size="tiny">
              <List.Item>
                <List.Header>{t('lectures.list.item_from')}</List.Header>
              </List.Item>
              {relatedItems}
            </List>
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
    switch (this.props.tab) {
    case 'virtual-lessons':
      ct = [CT_VIRTUAL_LESSON];
      break;
    case 'lectures':
      ct = [CT_LECTURE];
      break;
    case 'women-lessons':
      ct = [CT_WOMEN_LESSON];
      break;
    case 'children-lessons':
      ct = [CT_CHILDREN_LESSON];
      break;
    default:
      ct = [CT_VIRTUAL_LESSON];
      break;
    }

    return { content_type: ct };
  };

  render() {
    return (
      <UnitList
        namespace={`lectures-${this.props.tab}`}
        extraFetchParams={this.extraFetchParams}
        renderUnit={renderUnit}
      />
    );
  }
}

export default Container;
