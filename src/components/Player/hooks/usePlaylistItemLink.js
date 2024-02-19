import { useSelector } from 'react-redux';
import { canonicalLink } from '../../../helpers/links';
import { stringify } from '../../../helpers/url';
import {
  mdbGetDenormCollectionSelector,
  mdbGetDenormContentUnitSelector,
  playlistGetInfoSelector,
  playlistGetItemByIdSelector
} from '../../../redux/selectors';

const usePlaylistItemLink = id => {
  const { cuId, id: _id, properties, ap } = useSelector(playlistGetItemByIdSelector)(id);
  const { baseLink, cId }                 = useSelector(playlistGetInfoSelector);
  const cu                                = useSelector(state => mdbGetDenormContentUnitSelector(state, cuId || _id));
  const ccu                               = useSelector(state => mdbGetDenormCollectionSelector(state, cId));

  if (baseLink) {
    return { pathname: baseLink, search: stringify({ ...properties, ap }) };
  }

  if (!cu) return false;
  return canonicalLink(cu, null, ccu);
};

export default usePlaylistItemLink;
