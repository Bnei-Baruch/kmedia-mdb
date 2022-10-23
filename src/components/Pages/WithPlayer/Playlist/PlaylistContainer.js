import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Page from './Page';
import { actions, selectors } from '../../../../redux/modules/playlist';
import { usePrevious } from '../../../../helpers/utils';

const PlaylistContainer = ({ cId, cuId, isC = false }) => {
  const { cuId: prevCuId, cId: prevCId, wip } = useSelector(state => selectors.getInfo(state.playlist));

  const prevIsC  = usePrevious(isC);
  const dispatch = useDispatch();

  //isC and prevIsC need for fix bug when go to the unit url from collection url
  //example: /lessons/series/cu/[cuUID] from lessons/series/c/[cUID]
  useEffect(() => {
    if (wip) return;

    if (cId !== prevCId || isC !== prevIsC) {
      dispatch(actions.build(cId, cuId));
    } else if (cuId && prevCuId !== cuId) {
      dispatch(actions.select(cuId));
    }
  }, [cId, cuId, isC, prevIsC, wip]);

  return <Page />;
};

const areEqual = (prevProps, nextProps) => {
  return (prevProps.cId === nextProps.cId && prevProps.cuId === nextProps.cuId);
};
export default React.memo(PlaylistContainer, areEqual);
