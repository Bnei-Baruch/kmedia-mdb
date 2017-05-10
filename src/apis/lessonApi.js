class lessonApi {
  static API_BACKEND = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_API_BACKEND : 'http://archive.kbb1.com/backend/';

  get = (url) => {
    return fetch(`${API_BACKEND}${url}`)
      .then(response => {
        return response.json();
      }).catch(error => {
        return error;
      });
  }

  fetchLessons = (params) => {
    const url = `collections?${Object.entries(params).map(pair => `${pair[0]}=${pair[1]}`).join('&')}`;
    return get(url);
  }
}

default export
lessonApi;
