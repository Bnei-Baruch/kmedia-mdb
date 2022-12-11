import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import { setLanguageInQuery, setMediaTypeInQuery, persistPreferredMediaType } from '../../helpers/player';
import { getQuery } from '../../helpers/url';

const UpdateLocation = () => {
  const history  = useHistory();
  const location = useLocation();

  const q                       = getQuery(location);
  const { mediaType, language } = useSelector(state => playlist.getInfo(state.playlist));

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

  return null;
};

export default UpdateLocation;
