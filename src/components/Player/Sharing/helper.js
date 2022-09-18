import { splitPathByLanguage, getQuery, stringify } from '../../../helpers/url';
import { toHumanReadableTime } from '../../../helpers/time';

export const POPOVER_CONFIRMATION_TIMEOUT = 2500;

export const getUrl = (path, start, end) => {
  const { protocol, hostname, port, pathname } = window.location;

  path                       = path || pathname;
  const { path: pathSuffix } = splitPathByLanguage(path);
  const shareUrl             = `${protocol}//${hostname}${port ? `:${port}` : ''}${pathSuffix}`;

  const q  = getQuery(window.location);
  // Set start end points
  q.sstart = toHumanReadableTime(start);
  if (end) {
    q.send = toHumanReadableTime(end);
  }

  return `${shareUrl}?${stringify(q)}`;
};
