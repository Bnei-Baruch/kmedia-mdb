import { useSelector } from 'react-redux';

import { useSubscribeSeekAndTime } from '../../../../../pkg/jwpAdapter';
import { playerIsReadySelector } from '../../../../../redux/selectors';
import { findChapterIdx } from './helper';

// Current chapter index following the player (time/seek events, no polling)
const useCurrentChapter = chapters => {
  // re-render when the player becomes ready so the time subscription is attached
  useSelector(playerIsReadySelector);
  const { time } = useSubscribeSeekAndTime();

  return { time, idx: findChapterIdx(chapters, time) };
};

export default useCurrentChapter;
