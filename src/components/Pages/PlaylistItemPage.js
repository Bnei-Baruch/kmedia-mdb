import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { actions, selectors } from '../../redux/modules/mdb';
import WipErr from '../shared/WipErr/WipErr';
import PlaylistCollectionContainer from './PlaylistCollection/Container';
import UnitPage from './Unit/Page';
import { COLLECTION_DAILY_LESSONS, CT_LESSONS_SERIES, CT_SONGS, EVENT_TYPES } from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';

const COLLECTION_TYPES_BY_ROUTING = {
  'lessons': COLLECTION_DAILY_LESSONS,
  'lessons_series': CT_LESSONS_SERIES,
  'events': EVENT_TYPES,
  'music': CT_SONGS,
};

const PlaylistItemPage = ({ t }) => {
  const { id, routeType, tab } = useParams();

  const unit = useSelector(state => selectors.getDenormContentUnit(state.mdb, id), shallowEqual);
  const wip  = useSelector(state => selectors.getWip(state.mdb).units[id]);
  const err  = useSelector(state => selectors.getErrors(state.mdb).units[id]);

  //fetch unit if not exists or without collection only once
  const [needToFetch, setNeedToFetch] = useState(!unit || Object.keys(unit.collections).length === 0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err && needToFetch) {
      dispatch(actions.fetchUnit(id));
      setNeedToFetch(false);
    }
  }, [dispatch, err, id, wip, needToFetch]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  if (!unit) return null;

  if (routeType === 'program' || isEmpty(unit.collections)) return <UnitPage />;

  let cId;
  if (routeType === 'music' && tab) {
    cId = tab;  //tab has current collectionId, so use it
  } else {
    const cTypes = COLLECTION_TYPES_BY_ROUTING[!tab ? routeType : `${routeType}_${tab}`];
    if (!cTypes) return <UnitPage />;

    const collection = Object.values(unit.collections).find(c => cTypes.includes(c.content_type));

    if (!collection) {
      return <UnitPage />;
    }

    cId = collection.id;
  }

  return <PlaylistCollectionContainer cId={cId} cuId={id} />;
};

export default withNamespaces()(PlaylistItemPage);
