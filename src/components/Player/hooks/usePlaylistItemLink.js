import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/playlist';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { canonicalLink } from '../../../helpers/links';
import { stringify } from '../../../helpers/url';

const usePlaylistItemLink = id => {
  const { cuId, properties, ap } = useSelector(state => selectors.getItemById(state.playlist)(id));
  const { baseLink, cId }        = useSelector(state => selectors.getInfo(state.playlist));
  const cu                       = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));
  const ccu                      = useSelector(state => mdb.getDenormCollection(state.mdb, cId));

  if (baseLink) {
    return `.${baseLink}?${stringify({ ...properties, ap })}`;
  }
  if (!cu) return false;
  return canonicalLink(cu, null, ccu);
};

export default usePlaylistItemLink;
