import zlFetch from 'zl-fetch';

const API_BACKEND = process.env.REACT_APP_API_BACKEND;
const LESSONS     = 'DAILY_LESSON';

class LessonApi {

  static makeUrl = params => `${API_BACKEND}/collections?${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;

  static getAllLessons(args) {
    const params = Object.assign(args, { content_type: LESSONS });
    return zlFetch(this.makeUrl(params));
  }
}

export default LessonApi;
