import zlFetch from 'zl-fetch';

const API_ROOT = process.env.REACT_APP_API_BACKEND;

class Requests {
  static get        = url => zlFetch(`${API_ROOT}${url}`);
  static makeParams = params => `${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;
  static limit      = (page, count) => `page_no=${page}&page_size=${count}`;
  static encode     = encodeURIComponent;
}

class LessonApi {
  static all = ({ language, pageNo, pageSize, ...rest }) => {
    const params = Object.assign({}, { language, order_by: 'id', ...rest });
    return Requests.get(`lessons?${Requests.limit(pageNo, pageSize)}&${Requests.makeParams(params)}`);
  };

  static get = ({ id, language }) => Requests.get(`content_units/${id}?${Requests.makeParams({ language })}`);
}

export default LessonApi;
