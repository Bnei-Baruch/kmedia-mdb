import moment from 'moment';
import 'moment-duration-format';

export const formatTime = (current) => {
  if (!current) return '00:00';

  const h = Math.floor(current / 3600);
  const m = Math.floor((current - (h * 3600)) / 60);
  const s = Math.floor(current % 60);
  const result = [];

  if (h > 0) {
    result.push(h < 10 ? `0${h}` : `${h}`);
  }
  result.push(m < 10 ? `0${m}` : `${m}`);
  result.push(s < 10 ? `0${s}` : `${s}`);

  return result.join(':');
};


export const toHumanReadableTime = (current) => {
  if (!current) return '0s';

  const h = Math.floor(current / 3600);
  const m = Math.floor((current - (h * 3600)) / 60);
  const s = Math.floor(current % 60);

  let result = '';
  result += (h !== 0) ? `${h}h` : '';
  result += (m !== 0) ? `${m}m` : '';
  result += (s !== 0) ? `${s}s` : '';

  return result;
};

export const fromHumanReadableTime = (str) => {
  let h = str.match(/(\d+)h/i);
  let m = str.match(/(\d+)m/i);
  let s = str.match(/(\d+)s/i);

  h = (h == null) ? 0 : h[1];
  m = (m == null) ? 0 : m[1];
  s = (s == null) ? 0 : s[1];

  return moment.duration({
    hours: h,
    minutes: m,
    seconds: s,
  });
};

