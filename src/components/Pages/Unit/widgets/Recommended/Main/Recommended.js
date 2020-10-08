import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header, Item } from 'semantic-ui-react';

import { actions, selectors } from '../../../../../../redux/modules/recommended';
import { selectors as mdbSelectors } from '../../../../../../redux/modules/mdb';
import * as shapes from '../../../../../shapes';
import WipErr from '../../../../../shared/WipErr/WipErr';
import { canonicalLink } from '../../../../../../helpers/links';
import { formatDuration, canonicalCollection } from '../../../../../../helpers/utils';
import Link from '../../../../../Language/MultiLanguageLink';
import UnitLogo from '../../../../../shared/Logo/UnitLogo';

const Recommended = ({ unit, t }) => {
  const wip = useSelector(state => selectors.getWip(state.recommended));
  const err = useSelector(state => selectors.getError(state.recommended));
  
  const [dataLoaded, setDataLoaded] = useState(false);
  const wipErr = WipErr({ wip, err, t });

  const dispatch = useDispatch();
  useEffect(() => {
    if (unit && !dataLoaded && !wip && !err){
      dispatch(actions.fetchRecommended(unit.id));
      setDataLoaded(true);
    }
  }, [dataLoaded, dispatch, unit, wip, err]);

  const recommendedItems = useSelector(state => selectors.getRecommendedItems(state.recommended)) || [];
  const recommendedUnits = useSelector(state => recommendedItems
    .map(item => mdbSelectors.getDenormContentUnit(state.mdb, item.uid))
    .filter(item => !!item)) || [];

  if (wipErr) {
    return wipErr;
  }

  if (recommendedUnits.length === 0){
    return null;
  }

  // console.log('recommendedItems:', recommendedItems);
  // console.log('recommendedUnits:', recommendedUnits);

  const unitCollection = canonicalCollection(unit);
  const unitCollectionId = unitCollection ? unitCollection.id : null;

  return (
    <div className="avbox__playlist-wrapper">
      <Header as="h3" content={t('materials.recommended.title')} />
      <Item.Group divided unstackable link className="avbox__playlist-view">
        {
          recommendedUnits
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

Recommended.propTypes = {
  unit: shapes.EventItem.isRequired,
  t: PropTypes.func.isRequired
}

const areEqual = (prevProps, nextProps) => prevProps.unit.id === nextProps.unit.id;

export default React.memo(withNamespaces()(Recommended), areEqual);