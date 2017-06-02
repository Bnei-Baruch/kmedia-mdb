import zlFetch from 'zl-fetch';

const API_ROOT = process.env.REACT_APP_API_BACKEND;
const LESSONS  = 'DAILY_LESSON';

class Requests {
  static get        = url => zlFetch(`${API_ROOT}${url}`);
  static makeParams = params => `${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;
  static limit      = (page, count) => `page_no=${page}&page_size=${count}`;
  static encode     = encodeURIComponent;
}

class LessonApi {
  static all = ({ language, pageNo, pageSize }) => {
    const params = Object.assign({}, { language, content_type: LESSONS, order_by: 'id' });
    return Requests.get(`collections?${Requests.limit(pageNo, pageSize)}&${Requests.makeParams(params)}`);
  };

  static get = (id, language) => Requests.get(`/content_units?id=${id}&language=${language}`);
}

export default LessonApi;
