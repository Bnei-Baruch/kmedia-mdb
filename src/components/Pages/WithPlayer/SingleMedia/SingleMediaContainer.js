import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SingleMediaPage from './SingleMediaPage';
import { actions, selectors } from '../../../../redux/modules/playlist';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import WipErr from '../../../shared/WipErr/WipErr';

const SingleMediaContainer = ({ t }) => {

  const { id } = useParams();

  const { cuId, isReady } = useSelector(state => selectors.getInfo(state.playlist));
  const wip               = useSelector(state => mdb.getWip(state.mdb).units[id]);
  const err               = useSelector(state => mdb.getErrors(state.mdb).units[id]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== cuId) {
      dispatch(actions.singleMediaBuild(id));
    }
  }, [cuId, id]);

  const wipErr = WipErr({ wip: wip || !isReady, err, t });
  if (wipErr) {
    return wipErr;
  }

  return <SingleMediaPage />;
};

export default withNamespaces()(SingleMediaContainer);
