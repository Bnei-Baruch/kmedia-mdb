import zlFetch from 'zl-fetch';

const API_BACKEND = process.env.NODE_ENV === 'production' ?
  '/backend/' :
  process.env.REACT_APP_API_BACKEND;

class Requests {
  static get        = url => zlFetch(`${API_BACKEND}${url}`);
  static makeParams = params =>
    `${Object.entries(params).map((pair) => {
      const key   = pair[0];
      const value = pair[1];

      if (Array.isArray(value)) {
        return value.map(val => `${key}=${val}`).join('&');
      }

      return `${key}=${value}`;
    }).join('&')}`;

  static limit  = (page, count) => `page_no=${page}&page_size=${count}`;
  static encode = encodeURIComponent;
}

export default class Api {
  static collection = ({ id, language }) => Requests.get(`collections/${id}?${Requests.makeParams({ language })}`);
  static unit       = ({ id, language }) => Requests.get(`content_units/${id}?${Requests.makeParams({ language })}`);
  static sources    = ({ language }) => Requests.get(`sources?${Requests.makeParams({ language })}`);
  static tags       = ({ language }) => Requests.get(`tags?${Requests.makeParams({ language })}`);

  static lessons = ({ language, pageNo, pageSize, ...rest }) => {
    const params = Object.assign({}, { language, ...rest });
    return Requests.get(`lessons?${Requests.limit(pageNo, pageSize)}&${Requests.makeParams(params)}`);
  };
  static collections = ({ content_type, language, pageNo, pageSize, ...rest }) => {
    const params = Object.assign({}, { language, content_type, ...rest });
    return Requests.get(`collections?${Requests.limit(pageNo, pageSize)}&${Requests.makeParams(params)}`);
  };
}
