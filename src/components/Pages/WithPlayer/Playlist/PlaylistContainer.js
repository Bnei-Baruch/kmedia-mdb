import React, { useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import PlaylistPage from './PlaylistPage';
import { actions, selectors } from '../../../../redux/modules/playlist';

const PlaylistContainer = ({ cId, t, cuId }) => {
  const { played, cId: playlistCId } = useSelector(state => selectors.getInfo(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (cId !== playlistCId) {
      dispatch(actions.build(cId, cuId));
    } else if (cuId && played !== cuId) {
      dispatch(actions.select(cuId));
    }
  }, [cId, cuId]);

  /*

    useEffect(() => {
      // next prev links only for lessons
      if (COLLECTION_DAILY_LESSONS.includes(content_type)) {
        // empty or no window
        if (!cWindow.data || cWindow.data.length === 0) {
          if (!wipMap.cWindow[cId]) {
            // no wip, go fetch
            fetchWindow(id, film_date);
          }
        } else {
          const { id: cWindowId, data } = cWindow;
          const curIndex                = data.indexOf(cId);
          if (cId !== cWindowId
            && (curIndex <= 0 || curIndex === collections.length - 1)
            && !wipMap.cWindow[cId]) {
            // it's not our window,
            // we're not in it (at least not in the middle, we could reuse it otherwise)
            // and our window is not wip
            fetchWindow(id, film_date);
          } else {
            // it's a good window, extract the previous and next links
            createPrevNextLinks(curIndex);
          }
        }
      }
    }, [cId, cWindow, content_type, wipMap.cWindow]);

  const fetchWindow = () => {
    const filmDate = moment.utc(film_date);
    dispatch(actions.fetchWindow({
      id,
      start_date: filmDate.subtract(5, 'days').format(DATE_FORMAT),
      end_date: filmDate.add(10, 'days').format(DATE_FORMAT)
    }));
  };
  */

  return <PlaylistPage cuId={cuId} cId={cId} />;
};

export default withNamespaces()(PlaylistContainer);