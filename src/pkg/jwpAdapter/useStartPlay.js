import React, { useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { selectors as player } from '../../redux/modules/player';
import { JWPLAYER_ID, MY_NAMESPACE_HISTORY } from '../../helpers/consts';
import { useLocation } from 'react-router-dom';
import { startEndFromQuery } from '../../components/Player/Controls/helper';
import pause from './index';
import { getSavedTime, findPlayedFile } from '../../components/Player/helper';
import { selectors as playlist } from '../../redux/modules/playlist';
import { selectors as my } from '../../redux/modules/my';

const useStartPlay = () => {
  const location       = useLocation();
  const { start, end } = startEndFromQuery(location);

  const isReady = useSelector(state => player.isReady(state.player));

  const item = useSelector(state => playlist.getPlayed(state.playlist), shallowEqual);
  const info = useSelector(state => playlist.getInfo(state.playlist), shallowEqual);
  const file = useMemo(() => findPlayedFile(item, info), [item, info]);

  const { cuId, cId, isSingleMedia } = info;

  const historyItem = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)?.find(x => x.content_unit_uid === cuId));
  const { fetched } = useSelector(state => my.getInfo(state.my, MY_NAMESPACE_HISTORY));

  const fileIdRef = useRef();



  // must be before next useEffect
  // null prev file id when open other collection
  useEffect(() => {
    fileIdRef.current = null;
  }, [cId]);

  //start from saved time on load or switch playlist item
  useEffect(() => {
    if (!isReady || start || end || !fetched || file.id === fileIdRef.current) return;
    const autoplay               = !!fileIdRef.current || isSingleMedia;
    const jwp                    = window.jwplayer(JWPLAYER_ID);
    const { current_time: seek } = getSavedTime(cuId, historyItem);

    if (!isNaN(seek) && seek > 0 && (seek + 10 < file.duration)) {
      jwp.seek(seek)[autoplay ? 'play' : 'pause']();
    } else if (autoplay) {
      jwp.play();
    }

    fileIdRef.current = file.id;
  }, [isReady, cuId, fileIdRef.current, start, end, isSingleMedia, file, historyItem, fetched]);

};

export default useStartPlay;
