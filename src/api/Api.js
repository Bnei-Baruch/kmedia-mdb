import zlFetch from 'zl-fetch';

const API_ROOT = process.env.REACT_APP_API_BACKEND;

class Requests {
  static get        = url => zlFetch(`${API_ROOT}${url}`);
  static makeParams = params =>
    `${Object.entries(params).map((pair) => {
      const key = pair[0];
      const value = pair[1];

      if (Array.isArray(value)) {
        return value.map(val => `${key}=${val}`).join('&');
      }

      return `${key}=${value}`;
    }).join('&')}`;

  static limit      = (page, count) => `page_no=${page}&page_size=${count}`;
  static encode     = encodeURIComponent;
}

export class LessonApi {
  static all = ({ language, pageNo, pageSize, ...rest }) => {
    const params = Object.assign({}, { language, order_by: 'id', ...rest });
    return Requests.get(`lessons?${Requests.limit(pageNo, pageSize)}&${Requests.makeParams(params)}`);
  };

  static get = ({ id, language }) => Requests.get(`content_units/${id}?${Requests.makeParams({ language })}`);
}

export class SourcesApi {
  static all = () => {
    return Requests.get('sources');
  };
}
