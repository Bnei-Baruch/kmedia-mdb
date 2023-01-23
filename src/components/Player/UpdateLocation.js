import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as playlist, actions as action } from '../../redux/modules/playlist';
import { selectors as mdb } from '../../redux/modules/mdb';
import { setLanguageInQuery, setMediaTypeInQuery, persistPreferredMediaType } from '../../helpers/player';
import { getQuery } from '../../helpers/url';
import { usePrevious } from '../../helpers/utils';
import { canonicalLink } from '../../helpers/links';

const UpdateLocation = () => {
  const history  = useHistory();
  const location = useLocation();

  const dispatch                            = useDispatch();
  const q                                   = getQuery(location);
  const { mediaType, language, nextUnitId } = useSelector(state => playlist.getInfo(state.playlist));
  const denormUnit                          = useSelector(state => mdb.nestedGetDenormContentUnit(state.mdb));
  const prevNextUnitId                      = usePrevious(nextUnitId);

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

  useEffect(() => {
    if (nextUnitId && nextUnitId !== prevNextUnitId) {
      const link = canonicalLink(denormUnit(nextUnitId));
      history.push({ pathname: link, search: location.search });
      dispatch(action.nullNextUnit());
    }
  }, [nextUnitId, location.search, history, denormUnit]);

  return null;
};

export default UpdateLocation;
