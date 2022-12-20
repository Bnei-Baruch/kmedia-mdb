import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import { setLanguageInQuery, setMediaTypeInQuery, persistPreferredMediaType } from '../../helpers/player';
import { getQuery } from '../../helpers/url';

const UpdateLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const q                       = getQuery(location);
  const { mediaType, language } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    if (language && language !== q.language) {
      setLanguageInQuery(navigate, location, language,);
    }
  }, [language, q.language, navigate]);

  useEffect(() => {
    if (mediaType && mediaType !== q.mediaType) {
      setMediaTypeInQuery(navigate, location, mediaType);
      persistPreferredMediaType(mediaType);
    }
  }, [mediaType, q.mediaType, location, navigate]);

  return null;
};

export default UpdateLocation;
