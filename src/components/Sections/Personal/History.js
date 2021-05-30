import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/home';
import { selectors as mdb } from '../../../redux/modules/mdb';
import Template from './Template';


const History = () => {
  const dispatch  = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchData(true));
  }, [dispatch]);


  const latestUnitsFn     = latestUnitIDs => state => Array.isArray(latestUnitIDs)
    ? latestUnitIDs.map(x => mdb.getDenormContentUnit(state.mdb, x))
    : [];

  const latestUnitIDs = useSelector(state => selectors.getLatestUnits(state.home));
  const latestUnits   = useSelector(latestUnitsFn(latestUnitIDs));

  return (
    <Template units={latestUnits} title={"History"} />
  )
}

export default History;
