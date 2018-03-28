import axios from 'axios';

const API_BACKEND    = process.env.REACT_APP_API_BACKEND;
const ASSETS_BACKEND = process.env.REACT_APP_ASSETS_BACKEND;
const IMAGINARY_URL  = process.env.REACT_APP_IMAGINARY_URL;

export const backendUrl   = path => `${API_BACKEND}${path}`;
export const assetUrl     = path => `${ASSETS_BACKEND}${path}`;
export const imaginaryUrl = path => `${IMAGINARY_URL}${path}`;

export class Requests {
  static get          = path => axios(backendUrl(path));
  static getAsset     = path => axios(assetUrl(path));
  static getImaginary = path => axios(imaginaryUrl(path));

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

class Api {
  static collection   = ({ id, language }) => Requests.get(`collections/${id}?${Requests.makeParams({ language })}`);
  static unit         = ({ id, language }) => Requests.get(`content_units/${id}?${Requests.makeParams({ language })}`);
  static sources      = ({ language }) => Requests.get(`sources?${Requests.makeParams({ language })}`);
  static tags         = ({ language }) => Requests.get(`tags?${Requests.makeParams({ language })}`);
  static publishers   = ({ language }) => Requests.get(`publishers?${Requests.makeParams({ language })}`);
  static home         = ({ language }) => Requests.get(`home?${Requests.makeParams({ language })}`);
  static latestLesson = ({ language }) => Requests.get(`latestLesson?${Requests.makeParams({ language })}`);
  static sqdata = ({ language }) => Requests.get(`sqdata?${Requests.makeParams({ language })}`);

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

  static search = ({ q, language, pageNo: page_no, pageSize: page_size, sortBy: sort_by, deb, searchId: search_id }) =>
    Requests.get(`search?${Requests.makeParams({ q, language, page_no, page_size, sort_by, deb, search_id })}`);

  static click = ({ mdbUid: mdb_uid, index, type, rank, searchId: search_id }) =>
    Requests.get(`click?${Requests.makeParams({ mdb_uid, index, type, rank, search_id })}`);

  static sourceIdx = ({ id }) =>
    Requests.getAsset(`sources/${id}/index.json`);

  static sourceContent = ({ id, name }) =>
    Requests.getAsset(`sources/${id}/${name}`);

  static unzip = ({ id }) =>
    Requests.getAsset(`api/unzip/${id}`);

  static doc2Html = ({ id }) =>
    Requests.getAsset(`api/doc2html/${id}`);
}

export default Api;
