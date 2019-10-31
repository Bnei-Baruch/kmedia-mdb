import axios from 'axios';

const API_BACKEND    = process.env.REACT_APP_API_BACKEND;
const ASSETS_BACKEND = process.env.REACT_APP_ASSETS_BACKEND;
const CMS_BACKEND    = process.env.REACT_APP_CMS_BACKEND || `${API_BACKEND}cms/`;
const IMAGINARY_URL  = process.env.REACT_APP_IMAGINARY_URL;

export const backendUrl   = path => `${API_BACKEND}${path}`;
export const assetUrl     = path => `${ASSETS_BACKEND}${path}`;
export const cmsUrl       = path => `${CMS_BACKEND}${path}`;
export const imaginaryUrl = path => `${IMAGINARY_URL}${path}`;

export class Requests {
  static get = path => axios(backendUrl(path));

  static getAsset = path => axios(assetUrl(path));

  static getCMS = (item, options) => {
    let url;
    switch (item) {
    case 'banner':
      url = `${cmsUrl('banners')}/${options.language}`;
      break;
    case 'person':
      url = `${cmsUrl('persons')}/${options.id}?language=${options.language}`;
      break;
    default:
      return null;
    }
    return axios(url);
  };

  static makeParams = params => (
    `${Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map((pair) => {
        const key   = pair[0];
        const value = pair[1];

        if (Array.isArray(value)) {
          return value.map(val => `${key}=${Requests.encode(val)}`).join('&');
        }

        return `${key}=${Requests.encode(value)}`;
      })
      //can happen if parameter value is empty array 
      .filter(p => p !== '')
      .join('&')}`
  );

  static encode = encodeURIComponent;
}

class Api {
  static collection = ({ id, language }) => Requests.get(`collections/${id}?${Requests.makeParams({ language })}`);

  static unit = ({ id, language }) => Requests.get(`content_units/${id}?${Requests.makeParams({ language })}`);

  static home = ({ language }) => Requests.get(`home?${Requests.makeParams({ language })}`);

  static latestLesson = ({ language }) => Requests.get(`latestLesson?${Requests.makeParams({ language })}`);

  static sqdata = ({ language }) => Requests.get(`sqdata?${Requests.makeParams({ language })}`);

  static lessons = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`lessons?${Requests.makeParams({ page_no, page_size, ...rest })}`)
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

  static tweets = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`tweets?${Requests.makeParams({ page_no, page_size, ...rest })}`)
  );

  static posts = ({ pageNo: page_no, pageSize: page_size, ...rest }) => (
    Requests.get(`posts?${Requests.makeParams({ page_no, page_size, ...rest })}`)
  );

  static post = (blog, id) => Requests.get(`posts/${blog}/${id}`);

  static tagDashboard = ({ id, language }) => Requests.get(`tags/${id}/dashboard?${Requests.makeParams({ language })}`);

  static autocomplete = ({ q, language }) => Requests.get(`autocomplete?${Requests.makeParams({ q, language })}`);

  static search = ({ q, language, pageNo: page_no, pageSize: page_size, sortBy: sort_by, deb, suggest, searchId: search_id }) => (
    Requests.get(`search?${Requests.makeParams({ q, language, page_no, page_size, sort_by, deb, suggest, search_id })}`)
  );

  static click = ({ mdbUid: mdb_uid, index, type, rank, searchId: search_id, deb }) => (
    Requests.get(`click?${Requests.makeParams({ mdb_uid, index, result_type: type, rank, search_id, deb })}`)
  );

  static getAsset = path => Requests.getAsset(path);

  static getCMS = (item, options) => Requests.getCMS(item, options);

  static simpleMode = ({ language, startDate: start_date, endDate: end_date }) => (
    Requests.get(`simple?${Requests.makeParams({ language, start_date, end_date })}`)
  );
}

export default Api;
