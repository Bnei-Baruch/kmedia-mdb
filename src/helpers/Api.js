import axios from 'axios';
import { MY_NAMESPACE_LABELS, MY_NAMESPACE_PLAYLIST_EDIT, MY_NAMESPACE_PLAYLISTS } from './consts';
import { kcUpdateToken } from '../pkg/ksAdapter/adapter';

export const API_BACKEND      = process.env.REACT_APP_API_BACKEND;
const ASSETS_BACKEND          = process.env.REACT_APP_ASSETS_BACKEND;
const CMS_BACKEND             = process.env.REACT_APP_CMS_BACKEND || `${API_BACKEND}cms/`;
const IMAGINARY_URL           = process.env.REACT_APP_IMAGINARY_URL;
const IMAGINARY_INTERNAL_HOST = process.env.REACT_APP_IMAGINARY_INTERNAL_HOST || 'localhost';
const API_FEED                = process.env.REACT_APP_FEED;
const CHRONICLES_BACKEND      = process.env.REACT_APP_CHRONICLES_BACKEND;
const PERSONAL_API_BACKEND    = process.env.REACT_APP_PERSONAL_API_BACKEND;
const FILE_TRIMMER_API        = process.env.REACT_APP_FILE_TRIMMER_API;
const MDB_REST_API_URL        = process.env.REACT_APP_MDB_REST_API_URL || `${API_BACKEND}mdb-api/`;

const backendUrl                      = path => `${API_BACKEND}${path}`;
const imaginaryUrl                    = path => `${IMAGINARY_URL}${path}`;
const feedUrl                         = path => `${API_FEED}${path}`;
export const assetUrl                 = path => `${ASSETS_BACKEND}${path}`;
export const cmsUrl                   = path => `${CMS_BACKEND}${path}`;
export const cLogoUrl                 = path => `${cmsUrl(`images/logos/${path}`)}`;
export const chroniclesUrl            = path => `${CHRONICLES_BACKEND}${path}`;
export const chroniclesBackendEnabled = CHRONICLES_BACKEND !== undefined;

const makeParams = params => (
  `${Object
    .entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(pair => {
      const key   = pair[0];
      const value = pair[1];

      if (Array.isArray(value)) {
        return value.map(val => `${key}=${encodeURIComponent(val)}`).join('&');
      }

      return `${key}=${encodeURIComponent(value)}`;
    })
    //can happen if parameter value is empty array
    .filter(p => p !== '')
    .join('&')}`
);

export class Requests {
  static encode = encodeURIComponent;

  static get = async path => {
    try {
      return await axios.get(backendUrl(path));
    } catch ({ response }) {
      return response;
    }
  };

  static getAsset = path => axios(assetUrl(path));

  static getCMS = (item, options) => {
    let url;
    switch (item) {
      case 'banner':
        url = `${cmsUrl('banners-list')}?${Requests.makeParams({ content_languages: options.contentLanguages })}`;
        break;
      case 'person':
        url = `${cmsUrl('persons')}/${options.id}?${Requests.makeParams({ content_languages: options.contentLanguages })}`;
        break;
      default:
        return null;
    }

    return axios(url);
  };

  static auth = (params, url, token, method = 'GET', retry = true) => {
    const config = {
      url,
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `bearer ${token}` }
    };

    if (method === 'GET') {
      config.url = `${url}?${Requests.makeParams(params)}`;
    } else {
      config.data = JSON.stringify(params);
    }

    return axios(config)
      .catch(err => {
        if (err.request?.status === 401 && retry) {
          return kcUpdateToken()
            .then(token => Requests.auth(params, url, token, method, false));
        }

        console.log('axios auth catch', err);
        return err;
      });
  };

  static makeParams = makeParams;

  static imaginary = (action, params) => {
    if (!params.url.startsWith('http')) {
      params.url = `http://${IMAGINARY_INTERNAL_HOST}${params.url}`;
    }

    return `${imaginaryUrl('thumbnail')}?${Requests.makeParams(params)}`;
  };
}

class Api {
  static collection = ({
    id,
    ui_language,
    content_languages
  }) => Requests.get(`collections/${id}?${Requests.makeParams({
    ui_language,
    content_languages
  })}`);

  static unit = ({
    id,
    ui_language,
    content_languages
  }) => Requests.get(`content_units/${id}?${Requests.makeParams({ ui_language, content_languages })}`);

  static home = ({ ui_language, content_languages }) => Requests.get(`home?${Requests.makeParams({
    ui_language,
    content_languages
  })}`);

  static latestLesson = ({
    ui_language,
    content_languages
  }) => Requests.get(`latestLesson?${Requests.makeParams({ ui_language, content_languages })}`);

  static sqdata = ({ ui_language, content_languages }) => Requests.get(`sqdata?${Requests.makeParams({
    ui_language,
    content_languages
  })}`);

  static lessons = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`lessons?${Requests.makeParams({ page_no, page_size, ...rest })}`)
  );

  static events = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`events?${Requests.makeParams({ page_no, page_size, ...rest })}`)
  );

  static collections = ({ contentTypes: content_type, pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`collections?${Requests.makeParams({ page_no, page_size, content_type, ...rest })}`)
  );

  static units = ({ contentTypes: content_type, pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`content_units?${Requests.makeParams({ page_no, page_size, content_type, ...rest })}`)
  );

  static unitsStats = ({ contentTypes: content_type, ...rest }) => (
    Requests.get(`stats/cu_class?${Requests.makeParams({ content_type, ...rest })}`)
  );

  static collectionsStats = ({ contentTypes: content_type, ...rest }) => (
    Requests.get(`stats/c_class?${Requests.makeParams({ content_type, ...rest })}`)
  );

  static labelsStats = rest => (
    Requests.get(`stats/label_class?${Requests.makeParams(rest)}`)
  );

  static elasticStats = ({ q, ui_language, content_languages }) => (
    Requests.get(`stats/search_class?${Requests.makeParams({ q, ui_language, content_languages })}`)
  );

  static countCU = params => Requests.get(`count_cu?${Requests.makeParams(params)}`);

  static tweets = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`tweets?${Requests.makeParams({ page_no, page_size, ...rest })}`)
  );

  static posts = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`posts?${Requests.makeParams({ page_no, page_size, ...rest })}`)
  );

  static post = (blog, id) => Requests.get(`posts/${blog}/${id}`);

  static labels = params => Requests.get(`labels?${Requests.makeParams(params)}`);

  static tagDashboard = params => Requests.get(`tags/dashboard?${Requests.makeParams(params)}`);

  static autocomplete = ({ q, ui_language, content_languages }) => Requests.get(`autocomplete?${Requests.makeParams({
    q,
    ui_language,
    content_languages
  })}`);

  static search = (
    {
      q,
      ui_language,
      content_languages,
      pageNo: page_no,
      pageSize: page_size,
      sortBy: sort_by,
      deb,
      searchId: search_id
    }
  ) => (
    Requests.get(`search?${Requests.makeParams({
      q,
      ui_language,
      content_languages,
      page_no,
      page_size,
      sort_by,
      deb,
      search_id
    })}`)
  );

  static click = ({ mdbUid: mdb_uid, index, type, rank, searchId: search_id, deb }) => (
    Requests.get(`click?${Requests.makeParams({ mdb_uid, index, result_type: type, rank, search_id, deb })}`)
  );

  static getAsset = path => Requests.getAsset(path);

  static getUnzipUIDs = ({ path, ids }) => {
    const params = Requests.makeParams({ uid: ids });
    return Requests.getAsset(`${path}?${params}`);
  };

  static getCMS = (item, options) => Requests.getCMS(item, options);

  static simpleMode = ({ ui_language, content_languages, startDate: start_date, endDate: end_date }) => (
    Requests.get(`simple?${Requests.makeParams({ ui_language, content_languages, start_date, end_date })}`)
  );

  static recommendedRequestData = (
    {
      uid,
      languages,
      skipUids: skip_uids,
      size: more_items,
      spec,
      specs,
      watchingNowMin: watching_now_min,
      popularMin: popular_min
    }
  ) => ({
    more_items,
    'current_feed': [],
    'options': {
      'recommend': {
        uid
      },
      languages,
      skip_uids,
      spec,
      specs,
      watching_now_min,
      popular_min
    }
  });

  static recommended = requestData => {
    const config = {
      method: 'post',
      url: feedUrl('recommend'),
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(requestData)
    };

    return axios(config);
  };

  static views = uids => {
    const config = {
      method: 'post',
      url: feedUrl('views'),
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ uids })
    };

    return axios(config);
  };

  static watchingNow = uids => {
    const config = {
      method: 'post',
      url: feedUrl('watchingnow'),
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ uids })
    };

    return axios(config);
  };

  static my = (namespace, params, token, method = 'GET') => {
    let urlParam = namespace;
    if (namespace === MY_NAMESPACE_PLAYLIST_EDIT)
      urlParam = MY_NAMESPACE_PLAYLISTS;

    if (params.id) {
      urlParam = `${urlParam}/${params.id}`;
      delete params.id;
    }

    if (namespace === MY_NAMESPACE_PLAYLISTS && params.changeItems) {
      let p;
      switch (method) {
        case 'POST':
          p = 'add_items';
          break;
        case 'PUT':
          p = 'update_items';
          break;
        case 'DELETE':
          p = 'remove_items';
          break;
        default:
          p = '';
      }

      urlParam = `${urlParam}/${p}`;
      delete params.changeItems;
    }

    let isNotREST = false;
    if (namespace === MY_NAMESPACE_LABELS && method === 'GET') {
      isNotREST = true;
    }

    const url = `${PERSONAL_API_BACKEND}${isNotREST ? '' : 'rest/'}${urlParam}`;
    return Requests.auth(params, url, token, method);
  };

  static myNotes = (params, token, method = 'GET') => {
    let url = `${PERSONAL_API_BACKEND}rest/notes`;
    if (params.id) {
      url = `${url}/${params.id}`;
      delete params.id;
    }

    return Requests.auth(params, url, token, method);
  };

  static postLanguages = (data, token) => Requests.auth(data, `${PERSONAL_API_BACKEND}settings`, token, 'POST');
  static getLanguages  = token => Requests.auth({}, `${PERSONAL_API_BACKEND}languages`, token, 'GET');

  static reactionsCount = params => {
    const url    = `${PERSONAL_API_BACKEND}reaction_count?${Requests.makeParams(params)}`;
    const config = { url, method: 'GET' };
    return axios(config);
  };

  static trimFile = params => {
    const url    = `${FILE_TRIMMER_API}?${Requests.makeParams(params)}`;
    const config = { url, method: 'GET' };
    return axios(config);
  };

  static mdbCreateLabel = (params, token) => {
    const url     = `${MDB_REST_API_URL}labels/`;
    const headers = { 'Content-Type': 'application/json', 'Authorization': `bearer ${token}` };
    const config  = { url, headers, method: 'POST', data: JSON.stringify(params) };
    return axios(config);
  };
}

export default Api;
