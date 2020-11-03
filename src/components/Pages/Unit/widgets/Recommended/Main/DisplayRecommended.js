import React from 'react';
import PropTypes from 'prop-types';
import { Header, Item } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import * as shapes from '../../../../../shapes';
import { canonicalLink } from '../../../../../../helpers/links';
import { formatDuration, canonicalCollection } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../../shared/Logo/UnitLogo';

// items to show
const N = 12;

const DisplayRecommended = ({ unit, t, recommendedUnits }) => {
  // display only N units
  const unitsToDisplay = recommendedUnits.length > N ? recommendedUnits.slice(0, N) : recommendedUnits;

  const unitCollection = canonicalCollection(unit);
  const unitCollectionId = unitCollection ? unitCollection.id : null;

  return (
    <div className="avbox__playlist-wrapper">
      <Header as="h3" content={t('materials.recommended.title')} />
      <Item.Group divided unstackable link className="avbox__playlist-view">
        {
          unitsToDisplay
            .map(rUnit => (
              <Item
                key={rUnit.id}
                as={Link}
                to={canonicalLink(rUnit)}
                className="recommended-same-collection__item"
              >
                <Item.Image size="small">
                  <UnitLogo
                    unitId={rUnit.id}
                    collectionId={unitCollectionId}
                    width={150}
                    fallbackImg='programs'
                  />
                </Item.Image>
                <Item.Content verticalAlign="top">
                  <Header as="h5">
                    <small className="text grey uppercase recommended-same-collection__item-title">
                      {t('values.date', { date: rUnit.film_date })}
                    </small>
                    <br />
                    <span className="recommended-same-collection__item-name">
                      {rUnit.name}
                    </span>
                  </Header>
                  {
                    rUnit.duration && (
                      <Item.Meta>
                        <small>{formatDuration(rUnit.duration)}</small>
                      </Item.Meta>
                    )
                  }
                </Item.Content>
              </Item>
            ))
        }
      </Item.Group>
    </div>
  );
}

DisplayRecommended.propTypes = {
  unit: shapes.EventItem.isRequired,
  recommendedUnits: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func.isRequired
}

const areEqual = (prevProps, nextProps) => 
  prevProps.unit.id === nextProps.unit.id && 
  isEqual(prevProps.recommendedUnits, nextProps.recommendedUnits);

export default React.memo(DisplayRecommended, areEqual);