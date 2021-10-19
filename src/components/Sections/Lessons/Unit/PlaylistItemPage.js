import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../../redux/modules/mdb';
import WipErr from '../../../shared/WipErr/WipErr';
import PlaylistCollectionContainer from '../../../Pages/PlaylistCollection/Container';
import UnitPage from '../../../Pages/Unit/Page';
import { COLLECTION_DAILY_LESSONS, EVENT_TYPES } from '../../../../helpers/consts';

const COLLECTION_TYPES_BY_ROUTING = {
  'lessons': COLLECTION_DAILY_LESSONS,
  'events': EVENT_TYPES,
};

const PlaylistItemPage = ({ t }) => {
  const { id, routeType }             = useParams();
  const unit                          = useSelector(state => selectors.getDenormContentUnit(state.mdb, id));
  const wip                           = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err                           = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  //fix bug with unit without collection
  const [needToFetch, setNeedToFetch] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    setNeedToFetch(!unit || Object.keys(unit.collections).length === 0);
  }, [id]);

  useEffect(() => {
    if (!wip && !err && needToFetch) {
      dispatch(actions.fetchUnit(id));
      setNeedToFetch(false);
    }
  }, [dispatch, err, id, wip, needToFetch]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  if (!unit) return null;

  if (routeType === 'program' || !unit.collections) return <UnitPage />;

  const cTypes = COLLECTION_TYPES_BY_ROUTING[routeType];
  if (!cTypes) return <UnitPage />;

  const collection = Object.values(unit.collections).find(c => cTypes.includes(c.content_type));

  if (!collection) {
    return <UnitPage />;
  }

  return <PlaylistCollectionContainer cId={collection.id} cuId={id} />;
};

export default withNamespaces()(PlaylistItemPage);
