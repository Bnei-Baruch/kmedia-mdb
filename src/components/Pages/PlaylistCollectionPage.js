import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../redux/modules/mdb';
import WipErr from '../shared/WipErr/WipErr';
import PlaylistContainer from './WithPlayer/Playlist/PlaylistContainer';

const PlaylistCollectionPage = ({ t }) => {
  const { id } = useParams();

  const collection = useSelector(state => selectors.getDenormCollection(state.mdb, id));
  const wip        = useSelector(state => selectors.getWip(state.mdb).collections[id]);
  const err        = useSelector(state => selectors.getErrors(state.mdb).collections[id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!collection && !wip && !err) {
      dispatch(actions.fetchCollection(id));
    }
  }, [dispatch, collection, err, wip]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;
  const cuId = collection.content_units[0]?.id;

  return <PlaylistContainer cId={id} cuId={cuId} isC={true} />;
};

export default withNamespaces()(PlaylistCollectionPage);
