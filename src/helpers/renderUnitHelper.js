import React from 'react';
import { List } from 'semantic-ui-react';

import { NO_NAME } from './consts';
import { CollectionsBreakdown } from './mdb';
import { canonicalLink } from './links';
import { ellipsize } from './strings';
import Link from '../components/Language/MultiLanguageLink';
import UnitLogo from '../components/shared/Logo/UnitLogo';

export const commonRenderUnitForClips = (unit, t) => {
  const breakdown = getUnitCollectionsBreakdown(unit);
  const clips     = breakdown.getClips();

  const relatedItems = clips
    .map(x => renderUnitNameAsListItem(x))
    .concat(breakdown.getAllButClips()
      .map(x => renderUnitNameAsListItem(x)));

  return {
    link: canonicalLink(unit),
    filmDate: getFilmDate(unit, t),
    clips,
    relatedItems
  };
};

export const getUnitCollectionsBreakdown = unit =>
  new CollectionsBreakdown(Object.values(unit?.collections || {}));

export const getFilmDate = (unit, t) =>
  unit?.film_date && t('values.date', { date: unit.film_date })

export const renderFilmDate = filmDate =>
  <span className="index__date">{filmDate}</span>

export const renderUnitFilmDate = (unit, t) => {
  const filmDate = getFilmDate(unit, t)
  return filmDate && renderFilmDate(filmDate);
};

export const renderUnitNameAsListItem = (unit, ccu) =>
  unit && <List.Item key={unit.id} as={Link} to={canonicalLink(unit, null, ccu)}>
    {unit.name || NO_NAME}
  </List.Item>

export const renderUnitNameLink = (unit, className='index__title', ccu) =>
  unit && <Link className={className} to={canonicalLink(unit, null, ccu)}>
    {unit.name || NO_NAME}
  </Link>

export const renderUnitLogo = (unit, fallbackImg) =>
  unit && <Link to={canonicalLink(unit)}>
    <UnitLogo className="index__thumbnail" unitId={unit.id} fallbackImg={fallbackImg} />
  </Link>

export const renderUnitCollectionLogo = (unit, fallbackImg, collectionId) =>
  unit && <Link to={canonicalLink(unit)}>
    <UnitLogo
      className="index__thumbnail"
      unitId={unit.id}
      collectionId={collectionId}
      fallbackImg={fallbackImg}
    />
  </Link>

export const renderUnitDescription = unit =>
  unit?.description &&
  <div className="index__description mobile-hidden">
    {ellipsize(unit.description)}
  </div>

export const renderRelatedItems = (relatedItems, header, className='index__collections') =>
  relatedItems.length === 0
    ? null
    : (
      <List horizontal divided link className={className} size="tiny">
        <List.Item>
          <List.Header>
            {header}
          </List.Header>
        </List.Item>
        {relatedItems}
      </List>
    )
