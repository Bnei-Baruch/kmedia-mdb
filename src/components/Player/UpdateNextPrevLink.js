import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import usePlaylistItemLink from './hooks/usePlaylistItemLink';

const UpdateLocation = () => {
  const history = useHistory();

  const { cuId, cId, wip } = useSelector(state => playlist.getInfo(state.playlist));
  const prevCId                     = useRef(null);
  const prevCuId                    = useRef(null);
  const link                        = usePlaylistItemLink(cuId);

  useEffect(() => {
    if (cId !== prevCId.current) {
      prevCuId.current = null;
      prevCId.current  = cId;
    }
  }, [cId, prevCId]);

  useEffect(() => {
    if (!wip && prevCuId.current && prevCuId.current !== cuId) {
      history.push(link);
      prevCuId.current = link;
    }
  }, [cuId, prevCuId, link, wip]);

  return null;
};

export default UpdateLocation;
