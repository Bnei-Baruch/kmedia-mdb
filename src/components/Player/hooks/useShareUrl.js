import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { toHumanReadableTime } from '../../../helpers/time';
import { selectors as player } from '../../../redux/modules/player';
import { selectors as playlist } from '../../../redux/modules/playlist';
import { splitPathByLanguage, getQuery } from '../../../helpers/url';

const useShareUrl = () => {
  const [shareUrl, setShareUrl] = useState('');

  const location = useLocation();

  const { start, end }          = useSelector(state => player.getShareStartEnd(state.player));
  const { language, mediaType } = useSelector(state => playlist.getInfo(state.playlist));

  useEffect(() => {
    const { protocol, hostname, port, pathname } = window.location;

    const { path } = splitPathByLanguage(pathname);

    const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ''}${path}`);
    (!!start) && url.searchParams.set('sstart', toHumanReadableTime(start));
    (!!end && end !== Infinity) && url.searchParams.set('send', toHumanReadableTime(end));
    url.searchParams.set('mediaType', mediaType);
    url.searchParams.set('shareLang', language);
    const { c } = getQuery(location);
    if (c) url.searchParams.set('c', c);
    setShareUrl(url.toString());
  }, [start, end, mediaType, language, location]);

  return shareUrl;
};

export default useShareUrl;
