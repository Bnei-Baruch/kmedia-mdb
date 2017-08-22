import zlFetch from 'zl-fetch';

const API_BACKEND = process.env.NODE_ENV === 'production' ?
  '/backend/' :
  process.env.REACT_APP_API_BACKEND;

class Requests {
  static get        = url => zlFetch(`${API_BACKEND}${url}`);
  static makeParams = params =>
    `${Object.entries(params)
      .filter(([k, v]) => v !== undefined && v !== null)
      .map((pair) => {
        const key   = pair[0];
        const value = pair[1];

        if (Array.isArray(value)) {
          return value.map(val => `${key}=${val}`).join('&');
        }

        return `${key}=${value}`;
      }).join('&')}`;

  static encode = encodeURIComponent;
}

export default class Api {
  static collection = ({ id, language }) => Requests.get(`collections/${id}?${Requests.makeParams({ language })}`);
  static unit       = ({ id, language }) => Requests.get(`content_units/${id}?${Requests.makeParams({ language })}`);
  static sources    = ({ language }) => Requests.get(`sources?${Requests.makeParams({ language })}`);
  static tags       = ({ language }) => Requests.get(`tags?${Requests.makeParams({ language })}`);

  static lessons = ({ pageNo: page_no, pageSize: page_size, ...rest }) => {
    return Requests.get(`lessons?${Requests.makeParams({page_no, page_size, ...rest})}`);
  };

  static collections = ({ contentTypes: content_type, pageNo: page_no, pageSize: page_size, ...rest }) => {
    return Requests.get(`collections?${Requests.makeParams({page_no, page_size, content_type, ...rest})}`);
  };

  static units = ({ contentTypes: content_type, pageNo: page_no, pageSize: page_size, ...rest }) => {
    return Requests.get(`content_units?${Requests.makeParams({page_no, page_size, content_type, ...rest})}`);
  };

}
