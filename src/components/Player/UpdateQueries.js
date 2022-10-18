import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import helper from '../../helpers/player';
import { getQuery } from '../../helpers/url';

const UpdateQueries = () => {
  const history  = useHistory();
  const location = useLocation();

  const q                       = getQuery(location);
  const { mediaType, language } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    if (language && language !== q.language) {
      helper.setLanguageInQuery(history, language);
    }
  }, [language, q.language]);

  useEffect(() => {
    if (mediaType && mediaType !== q.mediaType) {
      helper.setMediaTypeInQuery(history, mediaType);
    }
  }, [mediaType, q.mediaType]);

  return null;
};

export default UpdateQueries;
