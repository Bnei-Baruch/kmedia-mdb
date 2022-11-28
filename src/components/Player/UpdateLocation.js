import React, { useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../redux/modules/playlist';
import { setLanguageInQuery, setMediaTypeInQuery } from '../../helpers/player';
import { getQuery } from '../../helpers/url';
import usePlaylistItemLink from './hooks/usePlaylistItemLink';

const UpdateLocation = () => {
  const history  = useHistory();
  const location = useLocation();

  const q                             = getQuery(location);
  const { mediaType, language, cuId } = useSelector(state => playlist.getInfo(state.playlist));

  const link     = usePlaylistItemLink(cuId);
  const prevLink = useRef('');

  useEffect(() => {
    if (language && language !== q.language) {
      setLanguageInQuery(history, language);
    }
  }, [language, q.language]);

  useEffect(() => {
    if (mediaType && mediaType !== q.mediaType) {
      setMediaTypeInQuery(history, mediaType);
    }
  }, [mediaType, q.mediaType]);

  useEffect(() => {
    if (link && prevLink.current !== link) {
      history.push(link);
      prevLink.current = link;
    }
  }, [link, prevLink]);

  return null;
};

export default UpdateLocation;
