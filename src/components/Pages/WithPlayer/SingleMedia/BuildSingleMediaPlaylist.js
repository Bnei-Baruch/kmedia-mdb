import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Helmets from '../../../shared/Helmets';
import { actions } from '../../../../redux/modules/playlist';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const BuildSingleMediaPlaylist = () => {
  const { id }        = useParams();
  const { cuId, wip } = useSelector(playlistGetInfoSelector);
  const dispatch      = useDispatch();

  useEffect(() => {
    if (!wip && id !== cuId) {
      dispatch(actions.singleMediaBuild(id));
    }
  }, [cuId, id, wip]);

  return <Helmets.AVUnit id={id}/>;
};

export default BuildSingleMediaPlaylist;
