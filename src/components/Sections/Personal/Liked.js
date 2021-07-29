import React, { useEffect } from 'react';
import Template from './helper';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdb } from '../../../redux/modules/mdb';

const Liked = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchLikes());
  }, [dispatch]);

  const latestUnitsFn = uids => state => Array.isArray(uids)
    ? uids.map(x => mdb.getDenormContentUnit(state.mdb, x))
    : [];

  const latestUnitIDs = useSelector(state => selectors.getLikes(state.my));
  const latestUnits   = useSelector(latestUnitsFn(latestUnitIDs)).filter(u => !!u);
  if (latestUnits.length === 0) return null;

  return (
    <Template units={latestUnits} title={'Liked'} rowsNumber={1} />
  );
};

export default Liked;
