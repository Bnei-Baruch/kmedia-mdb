import axios from 'axios';

const API_BACKEND = process.env.NODE_ENV === 'production' ?
  '/backend/' :
  process.env.REACT_APP_API_BACKEND;

const ASSETS_BACKEND = process.env.NODE_ENV === 'production' ?
  '/assets/' :
  process.env.REACT_APP_ASSETS_BACKEND;


export const assetUrl = path => `${ASSETS_BACKEND}${path}`;

class Requests {
  static get        = path => axios(`${API_BACKEND}${path}`);
  static getAsset   = path => axios(assetUrl(path));
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

  static lessons = ({ pageNo: page_no, pageSize: page_size, ...rest }) =>
    Requests.get(`lessons?${Requests.makeParams({ page_no, page_size, ...rest })}`);

  static collections = ({ contentTypes: content_type, pageNo: page_no, pageSize: page_size, ...rest }) =>
    Requests.get(`collections?${Requests.makeParams({ page_no, page_size, content_type, ...rest })}`);

  static units = ({ contentTypes: content_type, pageNo: page_no, pageSize: page_size, ...rest }) =>
    Requests.get(`content_units?${Requests.makeParams({ page_no, page_size, content_type, ...rest })}`);

  static recentlyUpdated = () =>
    Requests.get('recently_updated');

  static autocomplete = ({ q, language }) =>
    Requests.get(`autocomplete?${Requests.makeParams({ q, language })}`);

  static search = ({ q, language, pageNo: page_no, pageSize: page_size, sortBy: sort_by }) =>
    Requests.get(`search?${Requests.makeParams({ q, language, page_no, page_size, sort_by })}`);

  static sourceIdx = ({ id }) => Requests.getAsset(`sources/${id}/index.json`);

  static sourceContent = ({ id, name }) => Requests.getAsset(`sources/${id}/${name}`);
}
