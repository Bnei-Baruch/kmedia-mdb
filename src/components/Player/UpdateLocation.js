import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as playlist, actions as action, selectors } from '../../redux/modules/playlist';
import { selectors as mdb } from '../../redux/modules/mdb';
import { persistPreferredMediaType } from '../../helpers/player';
import { getQuery, stringify, updateQuery } from '../../helpers/url';
import { canonicalLink } from '../../helpers/links';
import { selectors as settings } from '../../redux/modules/settings';
import { actions, selectors as player } from '../../redux/modules/player';
import { startEndFromQuery } from './Controls/helper';
import { isEmpty } from '../../helpers/utils';

const UpdateLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch                           = useDispatch();
  const q                                  = getQuery(location);
  const uiLanguage                         = useSelector(state => settings.getLanguage(state.settings));
  const { start: prevStart, end: prevEnd } = useSelector(state => player.getShareStartEnd(state.player));

  const { mediaType, language, nextUnitId, cId, baseLink } = useSelector(state => playlist.getInfo(state.playlist));

  const denormUnit        = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const denormCollectiont = useSelector(state => mdb.nestedGetDenormCollection(state.mdb));
  const ap                = useSelector(state => selectors.getIndexById(state.playlist, nextUnitId));

  //init redux start end from location
  useEffect(() => {
    const _q = startEndFromQuery(location);
    if (_q.start !== prevStart || _q.end !== prevEnd) {
      dispatch(actions.setShareStartEnd(_q));
    }
  }, [location, prevStart, prevEnd]);

  useEffect(() => {
    const newq = {};
    if (language && language !== q.language) {
      newq.language = language;
    }

    if (mediaType && mediaType !== q.mediaType) {
      newq.mediaType = mediaType;
      persistPreferredMediaType(mediaType);
    }

    if (!isEmpty(newq)) {
      updateQuery(navigate, location, query => ({ ...query, ...newq }));
    }
  }, [mediaType, language, q, navigate, location]);

  //go to next on playlist
  const search = baseLink ? `?${stringify({ ...q, ap })}` : location.search;
  useEffect(() => {
    if (nextUnitId) {
      let link;
      if (baseLink) {
        link = baseLink;
      } else {
        link = canonicalLink(denormUnit(nextUnitId), null, denormCollectiont(cId));
      }

      navigate({ pathname: `/${uiLanguage}${link}`, search });
      dispatch(action.nullNextUnit());
    }
  }, [nextUnitId, cId, search, uiLanguage, baseLink, navigate, denormUnit, denormCollectiont]);

  return null;
};

export default UpdateLocation;
