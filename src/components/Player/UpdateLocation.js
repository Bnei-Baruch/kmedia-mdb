import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { actions as action } from '../../redux/modules/playlist';
import { persistPreferredMediaType } from '../../helpers/player';
import { getQuery, stringify, updateQuery } from '../../helpers/url';
import { canonicalLink } from '../../helpers/links';
import { actions } from '../../redux/modules/player';
import { startEndFromQuery } from './Controls/helper';
import {
  playlistGetIndexByIdSelector,
  playlistGetInfoSelector,
  settingsGetUILangSelector,
  mdbNestedGetDenormCollectionSelector,
  mdbNestedGetDenormContentUnitSelector
} from '../../redux/selectors';

const UpdateLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const q        = getQuery(location);
  const uiLang   = useSelector(settingsGetUILangSelector);

  const { mediaType, nextUnitId, cId, cuId, baseLink } = useSelector(playlistGetInfoSelector);

  const denormUnit        = useSelector(mdbNestedGetDenormContentUnitSelector);
  const denormCollectiont = useSelector(mdbNestedGetDenormCollectionSelector);
  const ap                = useSelector(state => playlistGetIndexByIdSelector(state, nextUnitId));

  //init redux start end from location
  useEffect(() => {
    const _q = startEndFromQuery(location);
    dispatch(actions.setShareStartEnd(_q));
  }, [location, cuId, dispatch]);

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
  }, [nextUnitId, cId, search, uiLang, baseLink, navigate, denormUnit, denormCollectiont, dispatch]);

  return null;
};

export default UpdateLocation;
