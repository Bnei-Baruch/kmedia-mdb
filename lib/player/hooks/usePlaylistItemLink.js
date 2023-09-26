import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../redux/slices/playlistSlice/playlistSlice';
import { selectors as mdb } from '../../redux/slices/mdbSlice/mdbSlice';
import { canonicalLink } from '../../../src/helpers/links';
import { stringify } from '../../../src/helpers/url';

const usePlaylistItemLink = id => {
  const { cuId, id: _id, properties, ap } = useSelector(state => selectors.getItemById(state.playlist)(id));
  const { baseLink, cId }                 = useSelector(state => selectors.getInfo(state.playlist));
  const cu                                = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId || _id));
  const ccu                               = useSelector(state => mdb.getDenormCollection(state.mdb, cId));

  if (baseLink) {
    return { pathname: baseLink, search: stringify({ ...properties, ap }) };
  }
  if (!cu) return false;
  return canonicalLink(cu, null, ccu);
};

export default usePlaylistItemLink;
