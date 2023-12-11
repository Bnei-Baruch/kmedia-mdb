import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Helmets from '../../../shared/Helmets';
import { actions, selectors } from '../../../../redux/modules/playlist';

const BuildSingleMediaPlaylist = () => {
  const { id }        = useParams();
  const { cuId, wip } = useSelector(state => selectors.getInfo(state.playlist));
  const dispatch      = useDispatch();

  useEffect(() => {
    if (!wip && id !== cuId) {
      dispatch(actions.singleMediaBuild(id));
    }
  }, [cuId, id, wip, dispatch]);

  return <Helmets.AVUnit id={id} />;
};

export default BuildSingleMediaPlaylist;
