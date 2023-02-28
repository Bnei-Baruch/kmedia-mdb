import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { actions, selectors } from '../../../redux/modules/playlist';
import { selectors as mdb, actions as mdbActions } from '../../../redux/modules/mdb';

const BuildPlaylistByUnit = ({ cts }) => {
  const { id } = useParams();

  const { cuId: prevCuId, cId: prevCId, wip } = useSelector(state => selectors.getInfo(state.playlist));

  const unit        = useSelector(state => mdb.getDenormContentUnit(state.mdb, id));
  const fetched     = useSelector(state => mdb.getFullUnitFetched(state.mdb))[id];
  const wipCU       = useSelector(state => mdb.getWip(state.mdb).units)[id];
  const errCU       = useSelector(state => mdb.getErrors(state.mdb).units)[id];
  const { id: cId } = (unit && Object.values(unit.collections).find(c => cts.includes(c.content_type))) || false;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wipCU && !errCU && !fetched) {
      dispatch(mdbActions.fetchUnit(id));
    }
  }, [errCU, wipCU, fetched, id]);

  useEffect(() => {
    if (wip || !fetched) return;
    if (!cId) {
      dispatch(actions.singleMediaBuild(id));
    } else if (cId !== prevCId) {
      dispatch(actions.build(cId, id));
    } else if (id && prevCuId !== id) {
      dispatch(actions.select(id));
    }
  }, [cId, id, prevCuId, wip, fetched]);

  return null;
};

export default BuildPlaylistByUnit;
