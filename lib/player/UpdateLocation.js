import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as playlist, actions as action, selectors } from '../redux/slices/playlistSlice/playlistSlice';
import { selectors as mdb } from '../redux/slices/mdbSlice/mdbSlice';
import { persistPreferredMediaType } from '../redux/slices/playlistSlice/helper';
import { getQuery, stringify, updateQuery } from '../../src/helpers/url';
import { canonicalLink } from '../../src/helpers/links';
import { selectors as settings } from '../redux/slices/settingsSlice/settingsSlice';
import { actions, selectors as player } from '../redux/slices/playerSlice/playerSlice';
import { startEndFromQuery } from './Controls/helper';

const UpdateLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch                           = useDispatch();
  const q                                  = getQuery(location);
  const uiLang                             = useSelector(state => settings.getUILang(state.settings));
  const { start: prevStart, end: prevEnd } = useSelector(state => player.getShareStartEnd(state.player));

  const { mediaType, nextUnitId, cId, cuId, baseLink } = useSelector(state => playlist.getInfo(state.playlist));

  const denormUnit        = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const denormCollectiont = useSelector(state => mdb.nestedGetDenormCollection(state.mdb));
  const ap                = useSelector(state => selectors.getIndexById(state.playlist, nextUnitId));

  //init redux start end from location
  useEffect(() => {
    const _q = startEndFromQuery(location);
    dispatch(actions.setShareStartEnd(_q));
  }, [location, cuId]);

  useEffect(() => {
    if (mediaType && mediaType !== q.mediaType) {
      const newq     = {};
      newq.mediaType = mediaType;
      persistPreferredMediaType(mediaType);
      updateQuery(navigate, location, query => ({ ...query, ...newq }));
    }
  }, [mediaType, q, navigate, location]);

  //go to next on playlist
  const search = baseLink ? stringify({ ...q, ap }) : location.search.slice(1);
  useEffect(() => {
    if (nextUnitId) {
      let to;
      if (baseLink) {
        to = { pathname: baseLink };
      } else {
        to = canonicalLink(denormUnit(nextUnitId), null, denormCollectiont(cId));
      }

      navigate({ pathname: `/${uiLang}${to.pathname}`, search });
      dispatch(action.nullNextUnit());
    }
  }, [nextUnitId, cId, search, uiLang, baseLink, navigate, denormUnit, denormCollectiont]);

  return null;
};

export default UpdateLocation;
