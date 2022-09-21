import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { actions, selectors, selectors as mdb } from '../../redux/modules/mdb';
import WipErr from '../shared/WipErr/WipErr';
import SingleMedia from './WithPlayer/SingleMedia/Page';
import { COLLECTION_DAILY_LESSONS, CT_LESSONS_SERIES, CT_SONGS, EVENT_TYPES } from '../../helpers/consts';
import PlaylistContainer from './WithPlayer/Playlist/PlaylistContainer';
import { NotFound } from '../../routes';

const COLLECTION_TYPES_BY_ROUTING = {
  'lessons': COLLECTION_DAILY_LESSONS,
  'lessons_series': CT_LESSONS_SERIES,
  'events': EVENT_TYPES,
  'music': CT_SONGS,
};

const PlaylistItemPage = ({ t }) => {
  const { id, routeType, tab } = useParams();

  const unit    = useSelector(state => selectors.getDenormContentUnit(state.mdb, id), shallowEqual);
  const err     = useSelector(state => selectors.getErrors(state.mdb).units[id]);
  const fetched = useSelector(state => mdb.getFullUnitFetched(state.mdb), shallowEqual);
  const wip     = useSelector(state => selectors.getWip(state.mdb).units[id]) && !fetched[id];

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wip && !err) {
      dispatch(actions.fetchUnit(id));
    }
  }, [dispatch, err, wip, id]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;

  if (!unit) return <NotFound />;

  if (routeType === 'program' || !unit.collections) return <SingleMedia />;

  const cTypes = COLLECTION_TYPES_BY_ROUTING[!tab ? routeType : `${routeType}_${tab}`];
  if (!cTypes) return <SingleMedia />;

  const collection = Object.values(unit.collections).find(c => cTypes.includes(c.content_type));

  if (!collection) {
    return <SingleMedia />;
  }

  return <PlaylistContainer cId={collection.id} cuId={id} />;
};

export default withNamespaces()(PlaylistItemPage);
