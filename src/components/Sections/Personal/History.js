import React from 'react';
import Template, { GetTempUnitIds } from './Template';

const History = () => {
  // const dispatch  = useDispatch();

  // useEffect(() => {
  //   dispatch(actions.fetchData(true));
  // }, [dispatch]);


  // const latestUnitsFn     = latestUnitIDs => state => Array.isArray(latestUnitIDs)
  //   ? latestUnitIDs.map(x => mdb.getDenormContentUnit(state.mdb, x))
  //   : [];

  // const latestUnitIDs = useSelector(state => selectors.getLatestUnits(state.home));
  // const latestUnits   = useSelector(latestUnitsFn(latestUnitIDs));

  const latestUnits = GetTempUnitIds();

  return (
    <Template units={latestUnits} title={"History"} />
  )
}

export default History;
