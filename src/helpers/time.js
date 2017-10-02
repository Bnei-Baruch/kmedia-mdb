export const formatTime = (current) => {
  if (!current) return '00:00';

  const h      = Math.floor(current / 3600);
  const m      = Math.floor((current - (h * 3600)) / 60);
  const s      = Math.floor(current % 60);
  const result = [];

  if (h > 0) {
    result.push(h < 10 ? `0${h}` : `${h}`);
  }
  result.push(m < 10 ? `0${m}` : `${m}`);
  result.push(s < 10 ? `0${s}` : `${s}`);

  return result.join(':');
};
