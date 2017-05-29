import zlFetch from 'zl-fetch';

const API_ROOT = process.env.REACT_APP_API_BACKEND;
const LESSONS  = 'DAILY_LESSON';

class Requests {
  static get        = url => zlFetch(`${API_ROOT}${url}`);
  static makeParams = params => `${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;
  static limit      = (count, page) => `page_no=${page}&page_size=${count}`;
  static encode     = encodeURIComponent;
}

class LessonApi {
  static all = ({ language, page_no, page_size }) => {
    const params = Object.assign({}, { language, content_type: LESSONS, order_by: 'id' });
    return Requests.get(`collections?${Requests.limit(page_size, page_no)}&${Requests.makeParams(params)}`);
  };

  static get = (id, language) => Requests.get(`/content_units?id=${id}&language=${language}`);
}

export default LessonApi;
