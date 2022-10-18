import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Page from './Page';
import { actions, selectors } from '../../../../redux/modules/playlist';

const PlaylistContainer = ({ cId, cuId }) => {
  const { cuId: pCuId, cId: pCId } = useSelector(state => selectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (cId !== pCId) {
      dispatch(actions.build(cId, cuId));
    } else if (cuId && pCuId !== cuId) {
      dispatch(actions.select(cuId));
    }
  }, [cId, cuId]);

  return <Page />;
};

const areEqual = (prevProps, nextProps) => {
  return (prevProps.cId === nextProps.cId && prevProps.cuId === nextProps.cuId);
};
export default React.memo(PlaylistContainer, areEqual);
