import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as playlist, actions as action, selectors } from '../../redux/modules/playlist';
import { selectors as mdb } from '../../redux/modules/mdb';
import { setLanguageInQuery, setMediaTypeInQuery, persistPreferredMediaType } from '../../helpers/player';
import { getQuery } from '../../helpers/url';
import { usePrevious } from '../../helpers/utils';
import { canonicalLink } from '../../helpers/links';
import { selectors as settings } from '../../redux/modules/settings';
import { actions } from '../../redux/modules/player';
import { startEndFromQuery } from './Controls/helper';

const UpdateLocation = () => {
  const history  = useHistory();
  const location = useLocation();

  const dispatch   = useDispatch();
  const q          = getQuery(location);
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));

  const { mediaType, language, nextUnitId, cId, basePath } = useSelector(state => playlist.getInfo(state.playlist));

  const denormUnit        = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const denormCollectiont = useSelector(state => mdb.nestedGetDenormCollection(state.mdb));
  const prevNextUnitId    = usePrevious(nextUnitId);
  const ap                = useSelector(state => selectors.getIndexById(state.playlist, nextUnitId));

  //init redux start end from location
  useEffect(() => {
    dispatch(actions.setShareStartEnd(startEndFromQuery(location)));
  }, [location]);

  useEffect(() => {
    if (language && language !== q.language) {
      setLanguageInQuery(history, language);
    }
  }, [language, q.language]);

  useEffect(() => {
    if (mediaType && mediaType !== q.mediaType) {
      setMediaTypeInQuery(history, mediaType);
      persistPreferredMediaType(mediaType);
    }
  }, [mediaType, q.mediaType]);

  //go to next on playlist
  const search = basePath ? { ap, ...location.search } : location.search;
  useEffect(() => {
    if (nextUnitId && nextUnitId !== prevNextUnitId) {
      let link;
      if (basePath) {
        link = basePath;
      } else {
        link = canonicalLink(denormUnit(nextUnitId), null, denormCollectiont(cId));
      }
      history.push({ pathname: `/${uiLanguage}${link}`, search });
      dispatch(action.nullNextUnit());
    }
  }, [nextUnitId, cId, search, uiLanguage, basePath, history, denormUnit, denormCollectiont]);

  return null;
};

export default UpdateLocation;
