import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import PlaylistPage from './PlaylistPage';
import { actions, selectors } from '../../../../redux/modules/playlist';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import WipErr from '../../../shared/WipErr/WipErr';

const PlaylistContainer = ({ cId, cuId, t }) => {
  const wipMap                                      = useSelector(state => mdb.getWip(state.mdb), shallowEqual);
  const errorMap                                    = useSelector(state => mdb.getErrors(state.mdb), shallowEqual);
  const fetched                                     = useSelector(state => mdb.getFullUnitFetched(state.mdb), shallowEqual);
  const { cuId: played, cId: playlistCId, isReady } = useSelector(state => selectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (cId !== playlistCId) {
      dispatch(actions.build(cId, cuId));
    } else if (cuId && played !== cuId) {
      dispatch(actions.select(cuId));
    }
  }, [cId, cuId]);

  const wip = !fetched[cuId] || wipMap.collections[cId] || wipMap.units[cuId] || !isReady;
  let err   = errorMap.collections[cId] || errorMap.units[cuId];

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  return <PlaylistPage />;
};

export default withNamespaces()(PlaylistContainer);
