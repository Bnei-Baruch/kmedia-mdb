import { getQuery } from '../../../helpers/url';
import { fromHumanReadableTime } from '../../../helpers/time';
import { PLAYER_POSITION_STORAGE_KEY } from '../constants';

export const timeToPercent = (sec, duration) => {
  if (!sec || sec === Infinity) return 0;
  if (!duration) return 0;
  return (100 * sec) / duration;
};

export const startEndFromQuery = location => {
  const q     = getQuery(location);
  const start = q.sstart ? fromHumanReadableTime(q.sstart).asSeconds() : 0;
  const end   = q.send ? fromHumanReadableTime(q.send).asSeconds() : Infinity;
  if (start > end)
    return { start: end, end: start };
  return { start, end };
};

export const saveTimeOnLocalstorage = (time, uid) => {
  if (time === 0) return;
  const msg = {
    timestamp: (new Date()).toISOString(),
    current_time: time
  };
  localStorage.setItem(`${PLAYER_POSITION_STORAGE_KEY}_${uid}`, JSON.stringify(msg));
};
