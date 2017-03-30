import axios from 'axios';

const API_BACKEND = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_API_BACKEND : 'http://archive.kbb1.com/backend/';

export const LESSONS = 'DAILY_LESSON';

const Fetcher = (url, callback) => axios.get(`${API_BACKEND}${url}`)
  .then(data => callback(data.data))
  .catch(ex => console.log(`get ${url}`, ex));

export const FetchCollections = (params, callback) => {
  const cb      = args => data => callback(args, data);
  const partial = cb(params);

  const url = `collections?${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;

  return Fetcher(url, partial);
};

export const FetchContentUnit = (id, params, callback) => {
  const cb      = args => data => callback(args, data);
  const partial = cb(params);

  const url = `content_units/${id}?${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;

  return Fetcher(url, partial);
};

// export default Fetcher;
