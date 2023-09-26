import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { toHumanReadableTime } from '../../../src/helpers/time';
import { selectors as player } from '../../redux/slices/playerSlice/playerSlice';
import { selectors as playlist } from '../../redux/slices/playlistSlice/playlistSlice';
import { splitPathByLanguage } from '../../../src/helpers/url';
import { selectors as settings } from '../../redux/slices/settingsSlice/settingsSlice';
import { useSearchParams } from 'next/navigation';

const useShareUrl = () => {
  const [shareUrl, setShareUrl] = useState('');

  const { c } = useSearchParams();

  const { start, end } = useSelector(state => player.getShareStartEnd(state.player));
  const { mediaType }  = useSelector(state => playlist.getInfo(state.playlist));
  const uiLang         = useSelector(state => settings.getUILang(state.settings));

  useEffect(() => {
    const { protocol, hostname, port, pathname, search } = window.location;

    const { path } = splitPathByLanguage(pathname);

    const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ''}${path}`);
    (!!start) && url.searchParams.set('sstart', toHumanReadableTime(start));
    (!!end && end !== Infinity) && url.searchParams.set('send', toHumanReadableTime(end));
    url.searchParams.set('mediaType', mediaType);
    url.searchParams.set('shareLang', uiLang);
    if (c) url.searchParams.set('c', c);
    setShareUrl(url.toString());
  }, [start, end, mediaType, uiLang, c]);

  return shareUrl;
};

export default useShareUrl;
