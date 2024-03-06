import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

import { actions } from '../../../redux/modules/playlist';
import { actions as mdbActions } from '../../../redux/modules/mdb';
import Helmets from '../../shared/Helmets';
import {
  mdbGetErrorsSelector,
  mdbGetFullUnitFetchedSelector,
  playlistGetInfoSelector,
  mdbGetWipFn,
  mdbGetDenormContentUnitSelector
} from '../../../redux/selectors';

const BuildPlaylistByUnit = ({ cts }) => {
  const { id }         = useParams();
  const [searchParams] = useSearchParams();

  const { id: prevCuId, cId: prevCId, wip } = useSelector(playlistGetInfoSelector);

  const unit    = useSelector(state => mdbGetDenormContentUnitSelector(state, id));
  const fetched = useSelector(mdbGetFullUnitFetchedSelector)[id];
  const wipCU   = useSelector(mdbGetWipFn).units[id];
  const errCU   = useSelector(mdbGetErrorsSelector).units[id];

  const cs          = (unit && Object.values(unit.collections)) || [];
  const { id: cId } = cs.find(c => c.id === (searchParams.get('c') || prevCId))
  || cs.find(c => cts.includes(c.content_type))
  || false;

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
      dispatch(actions.select({ id, cuId: id }));
    }
  }, [cId, id, prevCuId, wip, fetched, dispatch]);

  return <Helmets.AVUnit id={id} />;
};

export default BuildPlaylistByUnit;
