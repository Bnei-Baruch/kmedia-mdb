import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import usePlaylistItemLink from './hooks/usePlaylistItemLink';

const UpdateLocation = () => {
  const navigate = useNavigate();

  const { cuId, cId, wip } = useSelector(state => playlist.getInfo(state.playlist));
  const prevCId            = useRef(null);
  const prevCuId           = useRef(null);
  const link               = usePlaylistItemLink(cuId);

  useEffect(() => {
    if (cId !== prevCId.current) {
      prevCuId.current = null;
      prevCId.current  = cId;
    }
  }, [cId, prevCId]);

  useEffect(() => {
    if (!wip && prevCuId.current && prevCuId.current !== cuId) {
      navigate.push(link);
      prevCuId.current = link;
    }
  }, [cuId, prevCuId, link, wip, navigate]);

  return null;
};

export default UpdateLocation;
