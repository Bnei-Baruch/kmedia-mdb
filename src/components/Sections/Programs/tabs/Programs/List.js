import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_VIDEO_PROGRAM_CHAPTER, NO_NAME } from '../../../../../helpers/consts';
import { sectionThumbnailFallback } from '../../../../../helpers/images';
import { CollectionsBreakdown } from '../../../../../helpers/mdb';
import { canonicalLink } from '../../../../../helpers/links';
import { ellipsize } from '../../../../../helpers/strings';
import UnitList from '../../../../Pages/UnitList/Container';
import Link from '../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../shared/Logo/UnitLogo';

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const programs  = breakdown.getPrograms();

  const relatedItems = programs.map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name || NO_NAME}
    </List.Item>
  )).concat(breakdown.getAllButPrograms().map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name}
    </List.Item>
  )));

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
            collectionId={programs.length > 0 ? programs[0].id : null}
            fallbackImg={sectionThumbnailFallback.programs}
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
        <List horizontal divided link className="index__collections" size="tiny">
          <List.Item>
            <List.Header>{t('programs.list.episode_from')}</List.Header>
          </List.Item>
          {relatedItems}
        </List>
      </Table.Cell>
    </Table.Row>
  );
};

/* eslint-disable-next-line react/no-multi-comp */
class ProgramsList extends Component {
  extraFetchParams = () => ({
    content_type: [CT_VIDEO_PROGRAM_CHAPTER]
  });

  render() {
    return (
      <div>
        <UnitList
          namespace="programs-main"
          renderUnit={renderUnit}
          extraFetchParams={this.extraFetchParams}
        />
      </div>
    );
  }
}

export default ProgramsList;
